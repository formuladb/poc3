
--####################################################################################
DO $migration$
BEGIN
    -- BEGIN
    -- 	EXECUTE $$ DROP FUNCTION frmdb_put_table $$;
    -- EXCEPTION WHEN OTHERS THEN raise notice '% %', SQLERRM, SQLSTATE; END;
    
    CREATE OR REPLACE FUNCTION frmdb_create_role(
        p_role_name varchar
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_txt text;
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles  -- SELECT list can be empty for this
            WHERE  rolname ilike p_role_name) THEN

            v_stm := format($$ CREATE ROLE %I $$, p_role_name);
            EXECUTE v_stm;

            SELECT current_schema() INTO v_txt;
            v_stm := format($$ GRANT USAGE ON SCHEMA %I TO %I $$, v_txt, p_role_name);
            EXECUTE v_stm;

            RAISE NOTICE 'frmdb_create_role: % created', p_role_name;
        ELSE
            RAISE NOTICE 'frmdb_create_role: % already exists', p_role_name;
        END IF;
    END; $fun$ language 'plpgsql';
END;
$migration$;
