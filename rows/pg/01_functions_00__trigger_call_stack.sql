SELECT frmdb_set_type('frmdb_trg_call_stack_frame_t', $$
    CREATE TYPE frmdb_trg_call_stack_frame_t AS (
        logpref varchar,
        tg_op varchar,
        flag varchar,
        current_stack varchar
    );
$$);

CREATE OR REPLACE FUNCTION frmdb_trg_call_stack_frame(
    p_fun_name text,
    p_tg_op text,
    p_id varchar
) RETURNS frmdb_trg_call_stack_frame_t AS
$fun$ 
DECLARE
  res frmdb_trg_call_stack_frame_t;
BEGIN
    res.logpref := '[' || pg_backend_pid() || '] ' || p_fun_name  || ' ' || REPEAT('> ', pg_trigger_depth());
    res.tg_op := (CASE WHEN p_tg_op = 'DELETE' THEN 'DELETE' ELSE 'UPSERT' END)||'';
    res.flag := '//' || p_fun_name || '--' || res.tg_op || '--' || p_id || '//';
    res.current_stack := COALESCE(current_setting('frmdb_trg_call_stack.current', true), '');

    RETURN res;
END;
$fun$ language 'plpgsql';


CREATE OR REPLACE FUNCTION frmdb_trg_call_stack_push(
    p_fun_name text,
    p_tg_op text,
    p_id varchar
) RETURNS boolean AS
$fun$ 
DECLARE 
    v_fr frmdb_trg_call_stack_frame_t :=frmdb_trg_call_stack_frame(p_fun_name, p_tg_op, p_id);
BEGIN

    IF position(v_fr.flag in v_fr.current_stack) > 0 THEN
        RAISE NOTICE '%, %: loop detecting, stopping function call', v_fr.logpref, v_fr.flag;
        RETURN FALSE;
    ELSE
        RAISE NOTICE '% push % onto the call stack [%]', v_fr.logpref, v_fr.flag, v_fr.current_stack;
        PERFORM set_config('frmdb_trg_call_stack.current', v_fr.flag || v_fr.current_stack, true);
        RETURN TRUE;
    END IF;

END; 
$fun$ language 'plpgsql';


CREATE OR REPLACE FUNCTION frmdb_trg_call_stack_has(
    p_fun_name text,
    p_tg_op text,
    p_id varchar
) RETURNS boolean AS
$fun$ 
DECLARE 
    v_fr frmdb_trg_call_stack_frame_t :=frmdb_trg_call_stack_frame(p_fun_name, p_tg_op, p_id);
BEGIN

    IF position(v_fr.flag in v_fr.current_stack) > 0 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;

END; 
$fun$ language 'plpgsql';


CREATE OR REPLACE FUNCTION frmdb_trg_call_stack_pop(
    p_fun_name text,
    p_tg_op text,
    p_id varchar
) RETURNS boolean AS
$fun$ 
DECLARE 
    v_fr frmdb_trg_call_stack_frame_t :=frmdb_trg_call_stack_frame(p_fun_name, p_tg_op, p_id);
BEGIN

    IF starts_with(v_fr.current_stack, v_fr.flag) THEN
        RAISE NOTICE '% pop from call stack %', v_fr.logpref, v_fr.flag;
        PERFORM set_config('frmdb_trg_call_stack.current', 
            substring(v_fr.current_stack from (length(v_fr.flag) + 1)), true);
        RETURN TRUE;
    ELSE
        RAISE EXCEPTION '% frmdb_trg_call_stack_pop called with % not found in stack [%]', v_fr.logpref, v_fr.flag, v_fr.current_stack;
    END IF;

END; 
$fun$ language 'plpgsql';


CREATE OR REPLACE FUNCTION frmdb_trg_call_stack_get() RETURNS text AS $$
  SELECT current_setting('frmdb_trg_call_stack.current', true)
$$ LANGUAGE SQL;
