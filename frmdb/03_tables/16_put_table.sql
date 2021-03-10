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
                id %s NOT NULL,
                PRIMARY KEY(id)
            )
        $$, p_table_name, p_id_type);
        EXECUTE v_stm;
        
        v_stm := format($$ 
            ALTER TABLE %I ENABLE ROW LEVEL SECURITY
        $$, p_table_name);
        EXECUTE v_stm;

        PERFORM frmdb_put_column(p_table_name, 'created_at', 'timestamptz', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'created_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);
        PERFORM frmdb_put_column(p_table_name, 'updated_at', 'timestamptz', null, 'now()');
        PERFORM frmdb_put_column(p_table_name, 'updated_by', 'character varying', null, $$current_setting('request.jwt.claim.username', true)$$);

        PERFORM frmdb_install_common_columns_trg(p_table_name::regclass);

    END; $fun$ language 'plpgsql';
END;
$migration$;
