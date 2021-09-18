--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_reference_to_constraint_name (
    p_table_name regclass, 
    p_col_name varchar
) RETURNS varchar AS $fun$
BEGIN
    RETURN p_table_name || '__' || p_col_name || '__fk';
END; $fun$ language 'plpgsql';

--####################################################################################
--####################################################################################
-- Formula: 
-- REFERNCE_TO(another_table_name)
--####################################################################################
--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_column_REFERENCE_TO(
        p_table_name regclass, 
        p_col_name varchar,
        p_ref_table_name regclass,
        p_col_check varchar DEFAULT NULL,
        p_col_default varchar DEFAULT NULL,
        p_on_delete varchar DEFAULT 'RESTRICT'
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_stm varchar;
        v_col_type varchar;
        v_constraint_name varchar;
        v_existing_ref_table_name varchar;
        v_existing_ref_col_name varchar;
        v_to_add boolean;
    BEGIN

        SELECT data_type::varchar INTO v_col_type
            FROM information_schema.columns
                WHERE table_name = p_ref_table_name::name AND column_name = 'id';
        RAISE NOTICE 'frmdb_put_column_REFERENCE_TO: %.% references column %.id with type %.', p_table_name, p_col_name, p_ref_table_name, v_col_type;

        PERFORM frmdb_set_column(p_table_name, p_col_name, v_col_type);

        v_constraint_name := frmdb_reference_to_constraint_name(p_table_name, p_col_name);

        SELECT
            --tc.table_schema, 
            --tc.constraint_name, 
            --tc.table_name, 
            --kcu.column_name, 
            --ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        INTO v_existing_ref_table_name, v_existing_ref_col_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            --AND ccu.table_schema = tc.table_schema --need not necesarily be in the same schema
        WHERE 
            tc.constraint_type = 'FOREIGN KEY' 
            --AND tc.table_name = p_table_name
            AND tc.constraint_name =  v_constraint_name
            --AND kcu.column_name = p_col_name
        ;
        RAISE NOTICE 'frmdb_put_column_REFERENCE_TO: v_constraint_name=%, v_existing_ref_table_name=%, v_existing_ref_col_name=%, p_ref_table_name=%.', v_constraint_name, v_existing_ref_table_name, v_existing_ref_col_name, p_ref_table_name;

        IF v_existing_ref_table_name IS NOT NULL THEN
            IF v_existing_ref_table_name <> p_ref_table_name::varchar THEN
                v_stm := format($$ ALTER TABLE %I DROP CONSTRAINT %I
                $$, p_table_name, v_constraint_name);
                EXECUTE v_stm;
                RAISE NOTICE 'frmdb_put_column_REFERENCE_TO: removed constraint % referencing table %.', v_constraint_name, v_existing_ref_table_name;
                v_to_add := true;
            ELSE
                v_to_add := false;
            END IF;
        ELSE
            v_to_add := true;
        END IF;
        RAISE NOTICE 'frmdb_put_column_REFERENCE_TO: v_to_add=% v_existing_ref_table_name=%, v_existing_ref_col_name=%.', v_to_add, v_existing_ref_table_name, v_existing_ref_col_name;

        IF v_to_add THEN
            v_stm := format($$ ALTER TABLE %I ADD CONSTRAINT %I
                FOREIGN KEY (meta_tenant, %I) REFERENCES %I(meta_tenant, id) ON UPDATE CASCADE ON DELETE %s
            $$, p_table_name, v_constraint_name,
                p_col_name, p_ref_table_name, p_on_delete
            );
            EXECUTE v_stm;
            RAISE NOTICE 'frmdb_put_column_REFERENCE_TO: %', v_stm;
        END IF;		
        
        IF p_col_check IS NOT NULL THEN
            PERFORM frmdb_set_check(p_table_name, p_col_name, p_col_check);
        END IF;

        IF p_col_default IS NOT NULL THEN
            PERFORM frmdb_set_default(p_table_name, p_col_name, p_col_default);
        END IF;

        RETURN true;
    
    END; $fun$ language 'plpgsql';
END;
$migration$;
