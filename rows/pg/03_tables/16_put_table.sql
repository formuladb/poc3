DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'formula_string_type') THEN
        CREATE DOMAIN formula_string_type AS TEXT
            CHECK(VALUE ~ '^formula[(]');
    END IF;
END$$;

--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_table (
        p_table_name varchar, 
        p_id_type varchar default 'serial NOT NULL',
        p_with_tenant boolean default false
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_existing_policy varchar;
    BEGIN
        RAISE NOTICE 'frmdb_put_table: p_table_name=%, p_id_type={%}', p_table_name, p_id_type;
        
        --TODO: if id type has changed perform idempotent culumn migration
        IF p_with_tenant = true THEN 
            v_stm := format($$ 
                CREATE TABLE IF NOT EXISTS %I (
                    tenant text NOT NULL DEFAULT current_setting('request.jwt.claim.tenant', true),
                    id %s NOT NULL,
                    PRIMARY KEY(tenant, id)
                )
            $$, p_table_name, p_id_type);
        ELSE
            v_stm := format($$ 
                CREATE TABLE IF NOT EXISTS %I (
                    id %s NOT NULL,
                    PRIMARY KEY(id)
                )
            $$, p_table_name, p_id_type);
        END IF;
        EXECUTE v_stm;
        
        v_stm := format($$ 
            ALTER TABLE %I ENABLE ROW LEVEL SECURITY
        $$, p_table_name);
        EXECUTE v_stm;

        IF p_with_tenant = true THEN 
            SELECT policyname INTO v_existing_policy FROM pg_policies
                WHERE policyname = p_table_name || '_rls';
            IF v_existing_policy IS NULL THEN
                v_stm := format($$ 
                    CREATE POLICY %I_rls ON %I
                    USING (tenant = current_setting('request.jwt.claim.tenant', true))
                    WITH CHECK (tenant = current_setting('request.jwt.claim.tenant', true))
                $$, p_table_name, p_table_name);
                EXECUTE v_stm;
            END IF;
        END IF;

        PERFORM frmdb_put_column(p_table_name, 'meta_created_at', 'timestamp with time zone', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_created_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_at', 'timestamp with time zone', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);

        PERFORM frmdb_install_common_columns_trg(p_table_name::regclass);

    END; $fun$ language 'plpgsql';
END;
$migration$;
