--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_column(
        p_table_name regclass, 
        p_col_name varchar,
        p_col_type varchar,
        p_col_check varchar DEFAULT NULL,
        p_col_default varchar DEFAULT NULL,
        p_col_scalar_formula varchar DEFAULT NULL
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_stm varchar;
        v_existing_col_type varchar;
        v_col_type varchar;
        v_dirty boolean := false;
        v_ret boolean := false;
    BEGIN

        PERFORM frmdb_set_column(p_table_name, p_col_name, p_col_type, p_col_scalar_formula);

        IF p_col_check IS NOT NULL THEN
            PERFORM frmdb_set_check(p_table_name, p_col_name, p_col_check);
        END IF;

        IF p_col_default IS NOT NULL THEN
            PERFORM frmdb_set_default(p_table_name, p_col_name, p_col_default);
        END IF;

        RETURN v_dirty;
    END; $fun$ language 'plpgsql';
END;
$migration$;
