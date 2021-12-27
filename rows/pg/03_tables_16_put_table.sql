DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'formula_string_type') THEN
        CREATE DOMAIN formula_string_type AS TEXT
            CHECK(VALUE ~ '^formula[(]');
    END IF;
END$$;

CREATE SEQUENCE IF NOT EXISTS frmdb_put_table_seq;
CREATE OR REPLACE FUNCTION frmdb_short_uuid() returns text as $$
    SELECT to_hex(nextval('frmdb_put_table_seq'))
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE SECURITY DEFINER;

--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_table (
        p_table_name varchar, 
        p_id_type varchar default 'serial NOT NULL'
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_existing_policy varchar;
    BEGIN
        RAISE NOTICE 'frmdb_put_table: p_table_name=%, p_id_type={%}', p_table_name, p_id_type;
        
        --TODO: if id type has changed perform idempotent culumn migration
        v_stm := format($$ 
            CREATE TABLE IF NOT EXISTS %I (
                id %s ,
                PRIMARY KEY(id)
            )
        $$, p_table_name, p_id_type);
        EXECUTE v_stm;
        
        v_stm := format($$ 
            ALTER TABLE %I ENABLE ROW LEVEL SECURITY
        $$, p_table_name);
        EXECUTE v_stm;

        PERFORM frmdb_put_column(p_table_name, 'meta_created_at', 'timestamp with time zone', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_created_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_at', 'timestamp with time zone', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);

        PERFORM frmdb_install_common_columns_trg(p_table_name::regclass);

    END; $fun$ language 'plpgsql';
END;
$migration$;
