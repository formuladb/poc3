--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_table (
        p_table_name varchar, 
        p_id_type varchar default 'serial NOT NULL'
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
    BEGIN
        RAISE NOTICE 'frmdb_put_table: p_table_name=%, p_id_type={%}', p_table_name, p_id_type;
        
        --TODO: if id type has changed perform idempotent culumn migration
        v_stm := format($$ 
            CREATE TABLE IF NOT EXISTS %I (
                meta_tenant text NOT NULL DEFAULT current_setting('request.jwt.claim.tenant', true),
                id %s NOT NULL,
                PRIMARY KEY(meta_tenant, id)
            )
        $$, p_table_name, p_id_type);
        EXECUTE v_stm;
        
        v_stm := format($$ 
            ALTER TABLE %I ENABLE ROW LEVEL SECURITY
        $$, p_table_name);
        EXECUTE v_stm;

        v_stm := format($$ 
            CREATE POLICY %I_rls ON %I
            USING (meta_tenant = current_setting('request.jwt.claim.tenant', true))
            WITH CHECK (meta_tenant = current_setting('request.jwt.claim.tenant', true))
        $$, p_table_name, p_table_name);
        EXECUTE v_stm;

        PERFORM frmdb_put_column(p_table_name, 'meta_created_at', 'timestamptz', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_created_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_at', 'timestamptz', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'meta_updated_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);

        PERFORM frmdb_install_common_columns_trg(p_table_name::regclass);

    END; $fun$ language 'plpgsql';
END;
$migration$;
