DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dst_row_trigger_when') THEN
        CREATE DOMAIN dst_row_trigger_when AS TEXT
            CHECK(VALUE ~ '^BEFORE|AFTER$');
    END IF;
END$$;

CREATE OR REPLACE FUNCTION frmdb_set_formula_row_trigger_on_dst(
    p_when dst_row_trigger_when,
    p_prefix varchar,
    p_trigger_function_name regproc,
    p_src_table_name regclass, 
    p_src_col_name varchar,
    p_dst_table_name regclass, 
    p_dst_col_name varchar,
    p_args varchar[]
) RETURNS boolean AS 
$fun$ 
DECLARE 
    v_trigger_name varchar;
    v_stm varchar;
    v_stm2 varchar;
    v_exiting_trg_statement_comment varchar;
    v_stm_comment varchar;
    v_args_str varchar;
    v_rec RECORD;
    v_to_add boolean := false;
BEGIN 
    SELECT string_agg(format('%L', x), ', ') INTO v_args_str
    FROM unnest(ARRAY[p_src_table_name::varchar, p_src_col_name, 
        p_dst_table_name::varchar, p_dst_col_name] || p_args) as x;

    v_trigger_name := frmdb_get_trigger_prefix(p_prefix, p_dst_table_name, p_dst_col_name) || 'dt';  

    v_stm := format($$
        CREATE TRIGGER %I
            %s INSERT OR UPDATE OR DELETE ON %I
            FOR EACH ROW EXECUTE FUNCTION %I(%s)
    $$, v_trigger_name, p_when,
            p_dst_table_name,
                p_trigger_function_name, v_args_str
    );

    RETURN frmdb_set_trigger(v_trigger_name, p_dst_table_name, v_stm);
END; 
$fun$ language 'plpgsql';
