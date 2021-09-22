--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
DO $migration$ BEGIN
    CREATE OR REPLACE FUNCTION frmdb_put_table_GENERATED (
        p_table_name varchar, 
        p_base_table regclass,
        p_base_col_name varchar,
        p_sync_cols varchar[]
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_col_type varchar;
        v_col_default varchar;
        v_sync_col_name varchar;
    BEGIN
        RAISE NOTICE 'frmdb_put_table_GENERATED: p_table_name=%, p_base_table=%, p_base_col_name=%, p_sync_cols=%', 
            p_table_name, p_base_table, p_base_col_name, p_sync_cols;

        SELECT data_type::varchar INTO v_col_type FROM information_schema.columns
            WHERE table_name = p_base_table::name AND column_name = p_base_col_name;
        RAISE NOTICE 'frmdb_put_table_GENERATED: type of o2o column %.% is %.', p_base_table, p_base_col_name, v_col_type;

        PERFORM frmdb_put_table(p_table_name, v_col_type);

        IF p_base_col_name = 'id' THEN --this is a one-to-one relation
            PERFORM frmdb_put_column_REFERENCE_TO(p_table_name, 'id', p_base_table, null, null, 'CASCADE');
        END IF;

        FOREACH v_sync_col_name IN ARRAY p_sync_cols LOOP
            SELECT data_type::varchar INTO v_col_type FROM information_schema.columns
                WHERE table_name = p_base_table::name AND column_name = v_sync_col_name;
            RAISE NOTICE 'frmdb_put_table_GENERATED: type of %.% is %.', p_base_table, v_sync_col_name, v_col_type;

            PERFORM frmdb_put_column(p_table_name, v_sync_col_name, v_col_type);
        END LOOP;

        PERFORM frmdb_set_formula_statement_trigger_on_src(
            '', --p_prefix
            'frmdb_generated_table_sync_src_strg'::regproc,     --p_trigger_function_name
            p_base_table::regclass,                     --p_src_table_name
            p_base_col_name,                            --p_src_col_name
            p_table_name::regclass,                     --p_dst_table_name
            'id',                                       --p_dst_col_name
            p_sync_cols                                 --p_args
        );

    END; $fun$ language 'plpgsql';
END;
$migration$;


--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_generated_table_sync_src_strg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_sync_col1 varchar := TG_ARGV[4];
    v_sync_col2 varchar := TG_ARGV[5];
    v_sync_col3 varchar := TG_ARGV[6];
    v_sync_col4 varchar := TG_ARGV[7];

    v_in varchar := 'GENERATED[' || pg_backend_pid() || ':' || TG_NAME || '] ' || REPEAT('> ', pg_trigger_depth());
    v_stm varchar;
    v_loop_stm varchar;
    v_select_col_list varchar := 'id';
    v_insert_columns_list varchar;
    v_insert_values_list varchar;
    v_insert_on_conflict_list varchar;
    v_col_name varchar;
    v_rec RECORD;
    v_idx integer;
    v_cols varchar[] = ARRAY[]::varchar[];
    v_tmp_arr varchar[];
    v_syn_col_name varchar;
BEGIN
    RAISE NOTICE '%: %', v_in, TG_ARGV;

    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        FOREACH v_syn_col_name IN ARRAY ARRAY[v_sync_col1, v_sync_col2, v_sync_col3, v_sync_col4] LOOP
            IF v_syn_col_name IS NOT NULL THEN
                v_cols := v_cols || v_syn_col_name;
            END IF;
        END LOOP;

        v_tmp_arr := ARRAY[]::varchar[];
        v_idx := 2;
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            v_tmp_arr := v_tmp_arr || format('%I as col%s', v_syn_col_name, v_idx)::varchar;
            v_idx := v_idx + 1;
        END LOOP;
        v_select_col_list := array_to_string(v_tmp_arr, ', ');
        IF v_idx > 2 THEN
            v_select_col_list := ', ' || v_select_col_list;
        END IF;

        v_loop_stm := format($$ 
            SELECT %I as col1 %s FROM new_table 
        $$, v_src_col_name, v_select_col_list);

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            v_tmp_arr := v_tmp_arr || format('%I', v_syn_col_name)::varchar;
        END LOOP;
        v_insert_columns_list := array_to_string(v_tmp_arr, ', ');
        IF v_idx > 2 THEN
            v_insert_columns_list := ', ' || v_insert_columns_list;
        END IF;

        v_tmp_arr := ARRAY[]::varchar[];
        v_idx := 2;
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            v_tmp_arr := v_tmp_arr || ('$' || v_idx)::varchar;
            v_idx := v_idx + 1;
        END LOOP;
        v_insert_values_list := array_to_string(v_tmp_arr, ', ');
        IF v_idx > 2 THEN
            v_insert_values_list := ', ' || v_insert_values_list;
        END IF;

        v_tmp_arr := ARRAY[]::varchar[];
        FOREACH v_syn_col_name IN ARRAY v_cols LOOP
            v_tmp_arr := v_tmp_arr || format('%I = EXCLUDED.%I', v_syn_col_name, v_syn_col_name)::varchar;
        END LOOP;
        IF v_idx > 2 THEN
            v_insert_on_conflict_list := 'DO UPDATE SET ' || array_to_string(v_tmp_arr, ', ');
        ELSE
            v_insert_on_conflict_list := 'DO NOTHING';
        END IF;

        v_stm := format($$ 
            INSERT INTO %I ( id %s )
            VALUES ($1 %s)
            ON CONFLICT (tenant, id) %s
        $$, v_dst_table, v_insert_columns_list,
            v_insert_values_list,
            v_insert_on_conflict_list
        );

        FOR v_rec IN EXECUTE v_loop_stm LOOP
            RAISE NOTICE '%: %, $*=%', v_in, v_stm, v_rec;
            IF v_sync_col4 IS NOT NULL THEN
                EXECUTE v_stm USING v_rec.col1, v_rec.col2, v_rec.col3, v_rec.col4, v_rec.col5;
            ELSIF v_sync_col3 IS NOT NULL THEN
                EXECUTE v_stm USING v_rec.col1, v_rec.col2, v_rec.col3, v_rec.col4;
            ELSIF v_sync_col2 IS NOT NULL THEN
                EXECUTE v_stm USING v_rec.col1, v_rec.col2, v_rec.col3;
            ELSIF v_sync_col1 IS NOT NULL THEN
                EXECUTE v_stm USING v_rec.col1, v_rec.col2;
            ELSE
                EXECUTE v_stm USING v_rec.col1;
            END IF;
        END LOOP;
    END IF;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$fun$ LANGUAGE plpgsql;
