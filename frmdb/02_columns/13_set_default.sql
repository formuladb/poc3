--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_set_default(
        p_table_name regclass, 
        p_col_name varchar,
        p_col_default varchar
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_stm varchar;
        v_schema_name varchar := 'public';
        v_existing_default varchar;
        v_to_add boolean := false;
    BEGIN

        SELECT column_default INTO v_existing_default FROM information_schema.columns
            WHERE table_name = p_table_name::name AND column_name = p_col_name;
        RAISE NOTICE 'frmdb_set_default: v_existing_default=%.', v_existing_default;

        IF v_existing_default IS NOT NULL THEN
            IF v_existing_default::varchar <> p_col_default::varchar THEN
                v_to_add := true;
            ELSE
                v_to_add := false;
            END IF;
        ELSE
            v_to_add := true;
        END IF;
        RAISE NOTICE 'frmdb_set_default: v_to_add=% v_existing_default=%.', v_to_add, v_existing_default;

        IF v_to_add THEN
            v_stm := format($$ ALTER TABLE %I ALTER COLUMN %I SET DEFAULT %s
            $$, p_table_name, p_col_name, p_col_default);
            EXECUTE v_stm;
            RAISE NOTICE 'frmdb_set_default: set default % referencing table column %.%.', 
                v_existing_default, p_table_name, p_col_name;
        END IF;

        RETURN v_to_add;
    END; $fun$ language 'plpgsql';
END;
$migration$;
