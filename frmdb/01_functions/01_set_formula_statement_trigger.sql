CREATE OR REPLACE FUNCTION frmdb_set_formula_statement_trigger_on_src(
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
    v_stm_comment varchar;
    v_args_str varchar;
BEGIN 
    
    SELECT string_agg(format('%L', x), ', ') INTO v_args_str
        FROM unnest(ARRAY[p_src_table_name::varchar, p_src_col_name, 
            p_dst_table_name::varchar, p_dst_col_name] || p_args) as x;

    v_trigger_name := frmdb_get_trigger_prefix(p_prefix, p_dst_table_name, p_dst_col_name) || 'sit';  
    v_stm := format($$
        CREATE TRIGGER %I
            AFTER INSERT ON %I
            REFERENCING NEW TABLE AS new_table
            FOR EACH STATEMENT EXECUTE FUNCTION %I(%s)
    $$, v_trigger_name,
            p_src_table_name,
                p_trigger_function_name, v_args_str
    );
    PERFORM frmdb_set_trigger(v_trigger_name, p_src_table_name, v_stm);

    v_trigger_name := format('%I__%I__sut', p_dst_table_name, p_dst_col_name);  
    v_stm := format($$
        CREATE TRIGGER %I
            AFTER UPDATE ON %I
            REFERENCING OLD TABLE AS old_table NEW TABLE AS new_table
            FOR EACH STATEMENT EXECUTE FUNCTION %I(%s);
    $$, v_trigger_name,
            p_src_table_name,
                p_trigger_function_name, v_args_str
    );
    PERFORM frmdb_set_trigger(v_trigger_name, p_src_table_name, v_stm);

    v_trigger_name := format('%I__%I__sdt', p_dst_table_name, p_dst_col_name);  
    v_stm := format($$
        CREATE TRIGGER %I
            AFTER DELETE ON %I
            REFERENCING OLD TABLE AS old_table
            FOR EACH STATEMENT EXECUTE FUNCTION %I(%s);
    $$, v_trigger_name,
            p_src_table_name,
                p_trigger_function_name, v_args_str
    );
    PERFORM frmdb_set_trigger(v_trigger_name, p_src_table_name, v_stm);

    RETURN true;
END; 
$fun$ language 'plpgsql';
