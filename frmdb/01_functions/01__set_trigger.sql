CREATE OR REPLACE FUNCTION frmdb_set_trigger(
    p_trigger_name varchar,
    p_table_name regclass, 
    p_stm varchar
) RETURNS boolean AS 
$fun$ 
DECLARE 
    v_stm2 varchar;
    v_exiting_trg_statement_comment varchar;
    v_stm_comment varchar;
    v_args_str varchar;
    v_to_add boolean := false;
BEGIN 
    
    SELECT description INTO v_exiting_trg_statement_comment
        FROM pg_trigger
            INNER JOIN pg_class ON pg_class.oid = pg_trigger.tgrelid
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid 
        WHERE tgname = p_trigger_name;

    IF v_exiting_trg_statement_comment IS NULL THEN
        v_to_add := true;
    ELSIF '[[FRMDBTRG]]' || p_stm <> v_exiting_trg_statement_comment THEN
        v_stm2 := format($$DROP TRIGGER %I ON %I$$, p_trigger_name, p_table_name);
        EXECUTE v_stm2;
        v_to_add := true;
    END IF;

    IF v_to_add THEN
        EXECUTE p_stm;

        v_stm_comment := format($$ COMMENT ON TRIGGER %I on %I IS %L $$, 
            p_trigger_name, p_table_name, '[[FRMDBTRG]]' || p_stm);
        EXECUTE v_stm_comment;
    END IF;

    RETURN v_to_add;
END; 
$fun$ language 'plpgsql';

CREATE OR REPLACE FUNCTION frmdb_get_trigger_prefix(
    p_prefix varchar,
    p_table_name regclass,
    p_col_name varchar
) RETURNS varchar AS $$
    SELECT format('%I__%I__%I__', $1, $2, $3)
$$ LANGUAGE SQL IMMUTABLE;

CREATE OR REPLACE FUNCTION frmdb_get_complex_formulas(
    p_table_name regclass,
    p_col_name varchar
) RETURNS varchar AS
$fun$ 
DECLARE 
    v_trigger_name varchar;
    v_complex_formulas varchar;
BEGIN
    v_trigger_name := frmdb_get_trigger_prefix('', p_table_name, p_col_name);

    SELECT string_agg(action_statement, '^^^') INTO v_complex_formulas
        FROM information_schema.triggers WHERE trigger_name LIKE '%' || v_trigger_name || '%';

    RETURN v_complex_formulas;
END; 
$fun$ language 'plpgsql';
