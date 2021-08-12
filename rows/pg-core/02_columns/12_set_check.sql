--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_set_check(
        p_table_name regclass, 
        p_col_name varchar,
        p_col_check varchar
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_stm varchar;
        v_schema_name varchar := 'public';
        v_constraint_name varchar;
        v_existing_check varchar;
        v_to_add boolean := false;
    BEGIN
        v_constraint_name := p_table_name || '__' || p_col_name || '__ck';

        SELECT check_clause INTO v_existing_check FROM information_schema.check_constraints
            WHERE constraint_name = v_constraint_name;
        RAISE NOTICE 'frmdb_set_check: v_existing_check=%, v_constraint_name=%.', v_existing_check, v_constraint_name;

        IF v_existing_check IS NOT NULL THEN
            IF LOWER(v_existing_check) <> '(' || LOWER(p_col_check) || ')' THEN
                v_stm := format($$ ALTER TABLE %I DROP CONSTRAINT %I
                $$, p_table_name, v_constraint_name);
                EXECUTE v_stm;
                RAISE NOTICE 'frmdb_set_check: removed constraint % referencing table % (check %).', v_constraint_name, p_table_name, v_existing_check;
                v_to_add := true;
            ELSE
                v_to_add := false;
            END IF;
        ELSE
            v_to_add := true;
        END IF;
        RAISE NOTICE 'frmdb_set_check: v_to_add=% v_existing_check=%.', v_to_add, v_existing_check;

        IF v_to_add THEN
            v_stm := format($$ ALTER TABLE %I ADD CONSTRAINT %I CHECK (%s)
            $$, p_table_name, v_constraint_name, p_col_check);
            EXECUTE v_stm;
            RAISE NOTICE 'frmdb_set_check: check % added to table % (check %).', v_constraint_name, p_table_name, p_col_check;
        END IF;

        RETURN v_to_add;
    END; $fun$ language 'plpgsql';

    CREATE OR REPLACE FUNCTION frmdb_get_check(
        p_table_name regclass, 
        p_col_name varchar
    ) RETURNS varchar AS $fun$ 
    DECLARE
        v_constraint_name varchar;
        v_existing_check varchar;
        v_is_nullable varchar;
    BEGIN
        v_constraint_name := p_table_name || '__' || p_col_name || '__ck';

        SELECT check_clause INTO v_existing_check FROM information_schema.check_constraints
            WHERE constraint_name = v_constraint_name;

        SELECT is_nullable::varchar INTO v_is_nullable FROM information_schema.columns
            WHERE table_name = p_table_name::information_schema.sql_identifier
                AND column_name = p_col_name::information_schema.sql_identifier;
            
        RETURN COALESCE(v_existing_check, 
            CASE v_is_nullable WHEN 'NO' THEN ('is_not_null(' || p_col_name || ')') ELSE NULL END
        );
    END; $fun$ language 'plpgsql';
END;
$migration$;
