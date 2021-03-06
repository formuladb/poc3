--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
DO $migration$ BEGIN
    CREATE OR REPLACE FUNCTION frmdb_put_column_VLOOKUP(
        p_table_name regclass, 
        p_col_name varchar,
        p_src_table regclass,
        p_src_vlookup_col_name varchar,
        p_dst_join_col_name varchar,
        p_src_join_col_name varchar,
        p_filter_expr varchar
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_ctx varchar;
        v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
        v_stm varchar;
        v_col_type varchar;
        v_constraint_name varchar;
        v_ref_table_name varchar;
    BEGIN
        v_ctx := format('%s frmdb_put_column_VLOOKUP: p_table_name=%s, p_col_name=%s, p_src_table=%s, p_src_vlookup_col_name=%s, p_dst_join_col_name=%s, p_src_join_col_name=%s, p_filter_expr=%s', 
            v_in, p_table_name, p_col_name, p_src_table, p_src_vlookup_col_name, p_dst_join_col_name, p_src_join_col_name, p_filter_expr);
        RAISE NOTICE '%', v_ctx;

        SELECT data_type::varchar INTO v_col_type
            FROM information_schema.columns
                WHERE table_name = p_src_table::name AND column_name = p_src_vlookup_col_name
                    AND table_schema = current_schema()
        ;
        
        IF v_col_type IS NULL THEN
            RAISE EXCEPTION '% cannot find type for %.%', v_ctx, p_src_table, p_src_vlookup_col_name;
        END IF;
        RAISE NOTICE '% > frmdb_put_column_VLOOKUP: type of %.% is %.', v_in, p_src_table, p_src_vlookup_col_name, v_col_type;

        PERFORM frmdb_put_column(p_table_name, p_col_name, v_col_type);
        PERFORM frmdb_set_formula_row_trigger_on_dst(
            '55', --p_prefix --after ROLLUP
            'BEFORE',
            'frmdb_vlookup_dst_rtrg'::regproc,  --p_trigger_function_name
            p_src_table::regclass,             --p_src_table_name
            p_src_vlookup_col_name,             --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_dst_join_col_name, p_src_join_col_name, p_filter_expr] --p_args
        );
        PERFORM frmdb_set_formula_statement_trigger_on_src(
            '', --p_prefix
            'frmdb_vlookup_src_strg'::regproc, --p_trigger_function_name
            p_src_table::regclass,        --p_src_table_name
            p_src_vlookup_col_name,                 --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_dst_join_col_name, p_src_join_col_name, p_filter_expr] --p_args
        );

        RETURN true;
    END; $fun$ language 'plpgsql';
END;
$migration$;


--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_vlookup_src_strg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_vlookup_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_dst_join_col_name varchar  := TG_ARGV[4];
    v_src_join_col_name varchar  := TG_ARGV[5];
    v_filter_expr varchar := TG_ARGV[6];

    v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
    v_ctx varchar := format('%s VLOOKUP_src_s: %s', v_in, TG_ARGV); 

    v_delta_expr varchar;
    v_stm varchar;
    v_loop_stm varchar;
    v_rec RECORD;
BEGIN
    RAISE NOTICE '% VLOOKUP_src_s: %', v_in, TG_ARGV;

    IF TG_OP = 'DELETE' THEN
        v_loop_stm := format($$ 
            SELECT src.id as id,
                MIN(src.%I)
            FROM old_table src 
                INNER JOIN %I dst ON dst.%I = src.%I
            WHERE (%s)
            GROUP BY src.id
        $$, v_src_vlookup_col_name,
            v_dst_table_name, v_dst_join_col_name, v_src_join_col_name,
            v_filter_expr
        );
    ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        v_loop_stm := format($$ 
            SELECT dst.id as id,
                MIN(src.%I) as val
            FROM new_table src 
                RIGHT OUTER JOIN %I dst ON dst.%I = src.%I AND (%s)
            GROUP BY dst.id
        $$, v_src_vlookup_col_name,
            v_dst_table_name, v_dst_join_col_name, v_src_join_col_name,
            v_filter_expr
        );
    END IF;

    FOR v_rec IN EXECUTE v_loop_stm
    LOOP
        
        v_stm := format($$ UPDATE %I SET %I = %L
            WHERE id = %L
        $$, v_dst_table_name, v_dst_col_name, v_rec.val, 
                v_rec.id,
                v_dst_col_name, v_rec.val
        );
        RAISE NOTICE '% VLOOKUP_src_s: %', v_in, TRIM(v_stm);
        EXECUTE v_stm;
        RAISE NOTICE '% VLOOKUP_src_s: %', v_in, TRIM(v_stm);

    END LOOP;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$fun$ LANGUAGE plpgsql;



--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_vlookup_dst_rtrg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_vlookup_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_dst_join_col_name varchar  := TG_ARGV[4];
    v_src_join_col_name varchar  := TG_ARGV[5];
    v_filter_expr varchar := TG_ARGV[6];

    v_stm varchar;
    v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
    v_loop_stm varchar;
    v_src_rec RECORD;
    v_dst_h hstore;
BEGIN

    IF (TG_OP = 'DELETE' ) THEN
        RAISE NOTICE '% VLOOKUP_dst_r: %', v_in, TG_ARGV;
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        RAISE NOTICE '% VLOOKUP_dst_r: %, %', v_in, TG_ARGV, NEW;
        v_dst_h := hstore(NEW);

        v_stm := format($$ 
            SELECT src.id, src.%I as val 
            FROM %I src
                INNER JOIN json_populate_record(null::%I, %L) dst 
                    ON src.%I = dst.%I
            WHERE (%s)
            LIMIT 1
        $$, v_src_vlookup_col_name, 
            v_src_table_name, 
                    v_dst_table_name, row_to_json(NEW),
                    v_src_join_col_name, v_dst_join_col_name, 
                v_filter_expr
        );
        RAISE NOTICE '% VLOOKUP_dst_r: v_stm = (%).', v_in, v_stm;
        EXECUTE v_stm INTO v_src_rec;

        NEW := NEW #= hstore(v_dst_col_name, v_src_rec.val::varchar);  
        RAISE NOTICE '% VLOOKUP_dst_r: %.', v_in, row_to_json(NEW);
        RETURN NEW;
    ELSE --TG_OP = 'UPDATE' THEN
        RETURN NEW;
    END IF;
END;
$fun$ LANGUAGE plpgsql;
