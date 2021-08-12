-- --####################################################################################
-- DO $migration$
-- BEGIN
    
--         CREATE OR REPLACE FUNCTION frmdb_put_view (
--         p_view_name varchar, 
--         p_base_table_name regclass,
--         p_sync_cols varchar[]
--     ) RETURNS void AS $fun$ 
--     DECLARE
--         v_stm varchar;
--         v_col_type varchar;
--         v_col_default varchar;
--         v_sync_col_name varchar;
--     BEGIN
--         RAISE NOTICE 'frmdb_put_view: p_view_name=%, p_base_table_name={%}, p_sync_cols=%', 
--             p_view_name, p_base_table_name, p_sync_cols;

--         v_stm := format($$ 
--             CREATE OR REPLACE VIEW IF NOT EXISTS %I (
--                 id %s NOT NULL,
--                 PRIMARY KEY(id)
--             )
--         $$, p_table_name, p_id_type);
--         EXECUTE v_stm;

--     END; $fun$ language 'plpgsql';
-- END;
-- $migration$;
