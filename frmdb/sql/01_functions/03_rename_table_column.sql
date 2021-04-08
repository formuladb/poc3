CREATE OR REPLACE FUNCTION frmdb_rename_table_column (
    p_table_name regclass,
    p_old_col_name varchar, 
    p_new_col_name varchar
) RETURNS boolean AS $fun$
DECLARE
    v_stm varchar;
    v_new_trg_statement varchar;
    v_rec RECORD;
    v_new_trg_name varchar;
    v_stm_comment varchar;
BEGIN
    IF p_old_col_name = p_new_col_name THEN
        RAISE EXCEPTION 'frmdb_rename_table_column: p_old_col_name=% == p_new_col_name=%', p_old_col_name, p_new_col_name;
    END IF;

    v_stm := format($$ ALTER TABLE %I RENAME COLUMN %I TO %I $$,
        p_table_name, p_old_col_name, p_new_col_name);
    EXECUTE v_stm;


    FOR v_rec IN SELECT tgname, relname, pg_trigger.oid as trgoid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_class ON pg_class.oid = pg_trigger.tgrelid
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid 
        WHERE (description ~ ('^\[\[FRMDBTRG\]\]') AND description ~ ('[, (]''' || p_old_col_name || '''[, )]'))
    LOOP
        v_new_trg_statement := regexp_replace(
            regexp_replace(
                    regexp_replace(
                        replace(v_rec.trg_statement, '[[FRMDBTRG]]', ''), 
                        ' ON ' || p_old_col_name, ' ON ' || p_new_col_name
                    ),
                p_old_col_name || '__', p_new_col_name || '__'
            ),
            '([, (])''' || p_old_col_name || '''([, )])', '\1''' || p_new_col_name || '''\2'
        );
        RAISE NOTICE 'frmdb_rename_table_column: (% --> %), %, %, % ---> %', p_old_col_name, p_new_col_name, 
            v_rec.tgname, v_rec.trgoid, v_rec.trg_statement, v_new_trg_statement;
        
        v_stm := format($$ DROP TRIGGER %I ON %I $$, v_rec.tgname, v_rec.relname);
        EXECUTE v_stm;

        EXECUTE v_new_trg_statement;

        v_new_trg_name := regexp_replace(v_rec.tgname, p_old_col_name || '__', p_new_col_name || '__');

        v_stm_comment := format($$ COMMENT ON TRIGGER %I on %I IS %L $$, 
            v_new_trg_name, v_rec.relname, '[[FRMDBTRG]]' || v_new_trg_statement);
        EXECUTE v_stm_comment;

    END LOOP;

    RETURN true;
END;
$fun$ LANGUAGE plpgsql;
