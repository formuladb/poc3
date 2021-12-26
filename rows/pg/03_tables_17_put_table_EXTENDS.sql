--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
DO $migration$ BEGIN
    CREATE OR REPLACE FUNCTION frmdb_put_table_EXTENDS (
        p_table_name varchar, 
        p_extended_table_name regclass,
        p_sync_cols varchar[]
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_col_type varchar;
        v_col_default varchar;
        v_col_formula varchar;
        v_referenced_table varchar;
        v_existing_check varchar;
        v_sync_col_name varchar;
        v_trigger_on_dst_sync_cols varchar[];
    BEGIN
        RAISE NOTICE 'frmdb_put_table_EXTENDS: p_table_name=%, p_extended_table_name={%}, p_sync_cols=%', 
            p_table_name, p_extended_table_name, p_sync_cols;

        SELECT data_type::varchar INTO v_col_type FROM information_schema.columns
            WHERE table_name = p_extended_table_name::name AND column_name = 'id';
        RAISE NOTICE 'frmdb_put_table_EXTENDS: type of o2o column %.id is %.', p_extended_table_name, v_col_type;

        --WARN: assuming postgres sequence notation for serial id columns is <table name>_id_seq
        SELECT format($$nextval('%I')$$, c.relname) INTO v_col_default FROM pg_class c 
            WHERE c.relkind = 'S' AND c.relname = p_extended_table_name || '_id_seq';

        PERFORM frmdb_put_table(p_table_name, v_col_type);
        IF v_col_default IS NOT NULL THEN
            PERFORM frmdb_put_column(p_table_name, 'id', v_col_type, null, v_col_default);
        END IF;

        FOREACH v_sync_col_name IN ARRAY p_sync_cols LOOP
            SELECT CASE
                        WHEN data_type = 'USER-DEFINED' THEN udt_name::varchar
                        ELSE data_type::varchar
                    END,
                    generation_expression
                INTO v_col_type, v_col_formula
                FROM information_schema.columns
                WHERE table_name = p_extended_table_name::name AND column_name = v_sync_col_name;
            RAISE NOTICE 'frmdb_put_table_EXTENDS: type of %.% is %.', p_extended_table_name, v_sync_col_name, v_col_type;

            v_referenced_table := frmdb_get_reference_to(p_extended_table_name, v_sync_col_name);
            v_existing_check := frmdb_get_check(p_extended_table_name, v_sync_col_name);

            IF v_referenced_table IS NOT NULL THEN
                PERFORM frmdb_put_column_REFERENCE_TO(p_table_name, v_sync_col_name, v_referenced_table, v_existing_check, null);
            ELSE
                PERFORM frmdb_put_column(p_table_name, v_sync_col_name, v_col_type, v_existing_check);
            END IF;

            IF v_col_formula IS NULL THEN
                v_trigger_on_dst_sync_cols := array_append(v_trigger_on_dst_sync_cols, v_sync_col_name);
            ELSE
                v_trigger_on_dst_sync_cols := array_append(v_trigger_on_dst_sync_cols, ('__COMPUTED_ON_SRC__' || v_sync_col_name)::varchar);
            END IF;
        END LOOP;

        PERFORM frmdb_set_formula_statement_trigger_on_src(
            '', --p_prefix
            'frmdb_extends_sync_src_strg'::regproc,     --p_trigger_function_name
            p_extended_table_name::regclass,            --p_src_table_name
            'id',                                       --p_src_col_name
            p_table_name::regclass,                     --p_dst_table_name
            'id',                                       --p_dst_col_name
            p_sync_cols                                 --p_args
        );
        PERFORM frmdb_set_formula_row_trigger_on_dst(
            '', --p_prefix
            'BEFORE',
            'frmdb_extends_sync_dst_rtrg'::regproc,     --p_trigger_function_name
            p_extended_table_name::regclass,            --p_src_table_name
            'id',                                       --p_src_col_name
            p_table_name::regclass,                     --p_dst_table_name
            'id',                                       --p_dst_col_name
            v_trigger_on_dst_sync_cols                  --p_args
        );

    END; $fun$ language 'plpgsql';
END;
$migration$;


--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_extends_sync_src_strg() RETURNS TRIGGER AS $fun$
DECLARE
    v_in varchar := '[' || pg_backend_pid() || '] frmdb_extends_sync_src_strg ' || REPEAT('> ', pg_trigger_depth()) || TG_ARGV;
    v_src_table regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_sync_col1 varchar := TG_ARGV[4];
    v_sync_col2 varchar := TG_ARGV[5];
    v_sync_col3 varchar := TG_ARGV[6];
    v_sync_col4 varchar := TG_ARGV[7];

    v_stm varchar;
    v_loop_stm varchar;
    v_sync_col_select_list varchar := 'id';
    v_col_name varchar;
    v_rec RECORD;
    v_idx integer;
BEGIN
    IF frmdb_trg_call_stack_push('frmdb_extends_sync_src_strg', TG_OP, '__stm__') = FALSE THEN
        RETURN NULL;
    END IF;

    IF (TG_OP = 'DELETE' ) THEN
        v_loop_stm := format($$ 
            SELECT id FROM old_table 
        $$);
        FOR v_rec IN EXECUTE v_loop_stm LOOP
            IF current_setting('frmdb_extends_sync_dst_rtrg.delete', true) <> v_src_table || '--' || v_rec.id THEN
                v_stm := format($$ DELETE FROM %I WHERE id = %L 
                $$, v_dst_table, v_rec.id);
                EXECUTE v_stm;
            END IF;
        END LOOP;
    ELSIF TG_OP = 'UPDATE' THEN
        --INSERT not needed because computed values are returned to the dst trigger which in turn returns a modified NEW, see code RETURN NEW #= hstore(v_returning_rec);
        
        v_idx := 1;
        FOREACH v_col_name IN ARRAY ARRAY[v_sync_col1, v_sync_col2, v_sync_col3, v_sync_col4] 
        LOOP
            IF v_col_name IS NOT NULL THEN
                v_sync_col_select_list := v_sync_col_select_list || ', ' || v_col_name || ' as col' || v_idx;
            END IF;
            v_idx := v_idx + 1;
        END LOOP;

        v_loop_stm := format($$ 
            SELECT %s FROM new_table 
        $$, v_sync_col_select_list);

        IF v_sync_col1 IS NOT NULL THEN
            FOR v_rec IN EXECUTE v_loop_stm LOOP
                IF frmdb_trg_call_stack_has('frmdb_extends_sync_dst_rtrg', 'UPDATE', v_rec.id||'') = TRUE THEN
                    CONTINUE; -- avoid ERROR:  tuple to be updated was already modified by an operation triggered by the current command
                END IF;

                IF v_sync_col4 IS NOT NULL THEN
                    v_stm := format($$ UPDATE %I 
                        SET %I=%L, %I=%L, %I=%L, %I=%L 
                        WHERE id = %L
                    $$, v_dst_table,
                        v_sync_col1, v_rec.col1, v_sync_col2, v_rec.col2, v_sync_col3, v_rec.col3, v_sync_col4, v_rec.col4,
                        v_rec.id
                    );
                    RAISE NOTICE '% EXTENDS_src_s: %', v_in, v_stm;
                    EXECUTE v_stm;
                ELSIF v_sync_col3 IS NOT NULL THEN
                    v_stm := format($$ UPDATE %I 
                        SET %I=%L, %I=%L, %I=%L
                        WHERE id = %L
                    $$, v_dst_table,
                        v_sync_col1, v_rec.col1, v_sync_col2, v_rec.col2, v_sync_col3, v_rec.col3,
                        v_rec.id
                    );
                    RAISE NOTICE '% EXTENDS_src_s: %', v_in, v_stm;
                    EXECUTE v_stm;
                ELSIF v_sync_col2 IS NOT NULL THEN
                    v_stm := format($$ UPDATE %I 
                        SET %I=%L, %I=%L
                        WHERE id = %L
                    $$, v_dst_table,
                        v_sync_col1, v_rec.col1, v_sync_col2, v_rec.col2,
                        v_rec.id
                    );
                    RAISE NOTICE '% EXTENDS_src_s: %', v_in, v_stm;
                    EXECUTE v_stm;
                ELSIF v_sync_col1 IS NOT NULL THEN
                    v_stm := format($$ UPDATE %I 
                        SET %I=%L
                        WHERE id = %L
                    $$, v_dst_table,
                        v_sync_col1, v_rec.col1,
                        v_rec.id
                    );
                    RAISE NOTICE '% EXTENDS_src_s: %', v_in, v_stm;
                    EXECUTE v_stm;
                END IF;
            END LOOP;
        END IF;
    END IF;

    PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_src_strg', TG_OP, '__stm__');
    RETURN NULL; -- result is ignored since this is an AFTER trigger
EXCEPTION WHEN OTHERS THEN
    BEGIN PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_src_strg', TG_OP, '__stm__');
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE; END;
    RAISE;
END;
$fun$ LANGUAGE plpgsql;




--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_extends_sync_dst_rtrg() RETURNS TRIGGER AS $fun$
DECLARE
    v_in varchar := '[' || pg_backend_pid() || '] frmdb_extends_sync_src_strg ' || REPEAT('> ', pg_trigger_depth()) || TG_ARGV;

    v_src_table regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_sync_col1 varchar := TG_ARGV[4];
    v_sync_col2 varchar := TG_ARGV[5];
    v_sync_col3 varchar := TG_ARGV[6];
    v_sync_col4 varchar := TG_ARGV[7];

    v_stm varchar;
    v_syn_col_name varchar;
    v_NEW_h hstore := hstore(NEW);
    v_cols varchar[];
    v_tmp_arr varchar[];
    v_insert_columns_list varchar;
    v_insert_values_list varchar;
    v_insert_on_conflict_list varchar;
    v_returning_list varchar;
    v_returning_rec RECORD;
    v_id varchar := (CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END)||'';
BEGIN
    IF frmdb_trg_call_stack_push('frmdb_extends_sync_dst_rtrg', TG_OP, v_id) = FALSE THEN
        RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
    END IF;

    IF (TG_OP = 'DELETE' ) THEN
        PERFORM set_config('frmdb_extends_sync_dst_rtrg.delete', v_src_table || '--' || OLD.id, true);

        v_stm := format($$ DELETE FROM %I WHERE id = %L 
        $$, v_src_table, OLD.id);
        RAISE NOTICE '%: %', v_in, v_stm;
        EXECUTE v_stm;

        PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_dst_rtrg', TG_OP, v_id);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND row(NEW.*) IS DISTINCT FROM row(OLD.*))) THEN

        FOREACH v_syn_col_name IN ARRAY ARRAY['id', v_sync_col1, v_sync_col2, v_sync_col3, v_sync_col4] LOOP
            IF v_syn_col_name IS NOT NULL AND v_NEW_h?v_syn_col_name THEN
                v_cols := v_cols || v_syn_col_name;
            END IF;
        END LOOP;

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            IF v_syn_col_name NOT LIKE '__COMPUTED_ON_SRC__%' THEN
                v_tmp_arr := v_tmp_arr || format('%I', v_syn_col_name)::varchar;
            END IF; 
        END LOOP;
        v_insert_columns_list := array_to_string(v_tmp_arr, ', ');

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            IF v_syn_col_name NOT LIKE '__COMPUTED_ON_SRC__%' THEN
                v_tmp_arr := v_tmp_arr || format('%L', v_NEW_h->v_syn_col_name)::varchar;
            END IF; 
        END LOOP;
        v_insert_values_list := array_to_string(v_tmp_arr, ', ');

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            IF v_syn_col_name NOT LIKE '__COMPUTED_ON_SRC__%' THEN
                v_tmp_arr := v_tmp_arr || format('%I = EXCLUDED.%I', v_syn_col_name, v_syn_col_name)::varchar;
            END IF; 
        END LOOP;
        v_insert_on_conflict_list := array_to_string(v_tmp_arr, ', ');

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY ARRAY[v_sync_col1, v_sync_col2, v_sync_col3, v_sync_col4] LOOP
            IF v_syn_col_name IS NOT NULL THEN
                v_tmp_arr := v_tmp_arr || format('%I', replace(v_syn_col_name, '__COMPUTED_ON_SRC__', ''))::varchar;
            END IF;
        END LOOP;
        v_returning_list := array_to_string(v_tmp_arr, ', ');

        v_stm := format($$ 
            INSERT INTO %I ( %s )
            VALUES (%s)
            ON CONFLICT (tenant, id) DO UPDATE SET %s
            RETURNING %s
        $$, v_src_table, v_insert_columns_list,
            v_insert_values_list,
            v_insert_on_conflict_list,
            v_returning_list
        );
        RAISE NOTICE '%: %', v_in, v_stm;
        EXECUTE v_stm INTO v_returning_rec;
        RAISE NOTICE '%: %, %, %', v_in, v_stm, v_returning_rec, (NEW #= hstore(v_returning_rec));

        PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_dst_rtrg', TG_OP, v_id);
        RETURN NEW #= hstore(v_returning_rec);
    ELSE
        PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_dst_rtrg', TG_OP, v_id);
        RETURN NEW;
    END IF;
EXCEPTION WHEN OTHERS THEN
    BEGIN PERFORM frmdb_trg_call_stack_pop('frmdb_extends_sync_dst_rtrg', TG_OP, v_id);
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE; END;
    RAISE;
END;
$fun$ LANGUAGE plpgsql SECURITY DEFINER;
