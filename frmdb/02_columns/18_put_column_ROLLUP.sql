--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'frmdb_put_column_rollup_type') THEN
        CREATE TYPE frmdb_put_column_ROLLUP_type AS ENUM ('SUM', 'COUNT');
    END IF;
END$$;


DO $migration$ BEGIN
    CREATE OR REPLACE FUNCTION frmdb_put_column_ROLLUP(
        p_table_name regclass, 
        p_col_name varchar,
        p_src_table regclass,
        p_src_rollup_col_name varchar,
        p_rollup_type frmdb_put_column_ROLLUP_type,
        p_src_ref_col_name varchar,
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
        v_ctx := format('%s frmdb_put_column_ROLLUP: p_table_name=%s, p_col_name=%s, p_rollup_type=%s, p_src_table=%s, p_src_rollup_col_name=%s, p_src_ref_col_name=%s, p_filter_expr=%s', 
            v_in, p_table_name, p_col_name, p_rollup_type, p_src_table, p_src_rollup_col_name, p_src_ref_col_name, p_filter_expr);
        RAISE NOTICE '%', v_ctx;

        --TODO: check that p_src_ref_col_name is a REFERNCE_TO v_dst_table_name, or that v_dst_table_name is GENERATED from p_src_ref_col_name

        SELECT data_type::varchar INTO v_col_type
            FROM information_schema.columns
                WHERE table_name = p_src_table::name AND column_name = p_src_rollup_col_name	
        ;
        
        IF v_col_type IS NULL THEN
            RAISE EXCEPTION '% cannot find type for %.%', v_ctx, p_src_table, p_src_rollup_col_name;
        END IF;
        RAISE NOTICE '% > frmdb_put_column_ROLLUP: type of %.% is %.', v_in, p_src_table, p_src_rollup_col_name, v_col_type;

        PERFORM frmdb_put_column(p_table_name, p_col_name, v_col_type, 
            format('is_not_null(%I)', p_col_name)::varchar, '0'::varchar);
        PERFORM frmdb_set_formula_row_trigger_on_dst(
            'BEFORE',
            'frmdb_rollup_dst_rtrg'::regproc,  --p_trigger_function_name
            p_src_table::regclass,             --p_src_table_name
            p_src_rollup_col_name,             --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_rollup_type::varchar, p_src_ref_col_name, p_filter_expr] --p_args
        );
        PERFORM frmdb_set_formula_statement_trigger_on_src(
            'frmdb_rollup_src_strg'::regproc, --p_trigger_function_name
            p_src_table::regclass,        --p_src_table_name
            p_src_rollup_col_name,                 --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_rollup_type::varchar, p_src_ref_col_name, p_filter_expr] --p_args
        );

        RETURN true;
    END; $fun$ language 'plpgsql';
END;
$migration$;

--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_rollup_src_strg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_rollup_col_name varchar := TG_ARGV[3];
    v_rollup_type frmdb_put_column_ROLLUP_type := TG_ARGV[4]::frmdb_put_column_ROLLUP_type;
    v_src_ref_col_name varchar := TG_ARGV[5];
    v_filter_expr varchar := TG_ARGV[6];

    v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
    v_ctx varchar := format('%s ROLLUP_src_s: %s', v_in, TG_ARGV); 

    v_delta_expr varchar;
    v_stm varchar;
    v_tmp_stm varchar;
    v_loop_stm varchar;
    v_rec RECORD;
BEGIN
    RAISE NOTICE '% ROLLUP_src_s: %', v_in, TG_ARGV;

    IF TG_OP = 'DELETE' THEN
        IF v_rollup_type = 'SUM' THEN v_delta_expr := format('- %I', v_src_col_name);
        ELSE v_delta_expr := '- 1';
        END IF;
        v_tmp_stm := format($$ 
            SELECT %I as id, %s as delta FROM old_table WHERE (%s)
        $$, v_src_ref_col_name, v_delta_expr, v_filter_expr);
    ELSIF TG_OP = 'INSERT' THEN
        IF v_rollup_type = 'SUM' THEN v_delta_expr := format('+ %I', v_src_col_name);
        ELSE v_delta_expr := '+ 1';
        END IF;
        v_tmp_stm := format($$ 
            SELECT %I as id, %s as delta FROM new_table WHERE %s
        $$, v_src_ref_col_name, v_delta_expr, v_filter_expr);
    ELSE --TG_OP = 'UPDATE' THEN
        v_tmp_stm := format($$ 
                WITH ol AS (SELECT id, %I as ref, %I as val, %s as matches_filter FROM old_table),
                    nw AS (SELECT id, %I as ref, %I as val, %s as matches_filter FROM new_table)
                SELECT nw.ref as id, 
                    CASE 
                        WHEN %L = 'SUM' THEN
                            CASE 
                                WHEN ol.matches_filter AND nw.matches_filter THEN nw.val - ol.val
                                WHEN NOT ol.matches_filter AND nw.matches_filter THEN nw.val
                                WHEN ol.matches_filter AND NOT nw.matches_filter THEN - ol.val
                                WHEN NOT ol.matches_filter AND NOT nw.matches_filter THEN 0
                            END
                        WHEN %L = 'COUNT' THEN
                            CASE 
                                WHEN ol.matches_filter AND nw.matches_filter THEN 0
                                WHEN NOT ol.matches_filter AND nw.matches_filter THEN 1
                                WHEN ol.matches_filter AND NOT nw.matches_filter THEN - 1
                                WHEN NOT ol.matches_filter AND NOT nw.matches_filter THEN 0
                            END
                    END as delta 
                FROM ol INNER JOIN nw ON ol.id = nw.id AND ol.ref = nw.ref
                UNION ALL
                SELECT ol.ref as id,  
                        CASE 
                            WHEN ol.matches_filter THEN 
                                CASE 
                                    WHEN %L = 'SUM' THEN - ol.val
                                    WHEN %L = 'COUNT' THEN - 1
                                END
                            WHEN NOT ol.matches_filter THEN 0
                        END as delta
                FROM ol INNER JOIN nw ON ol.id = nw.id AND ol.ref <> nw.ref
                UNION ALL
                SELECT nw.ref as id,  
                        CASE 
                            WHEN nw.matches_filter THEN
                                CASE 
                                    WHEN %L = 'SUM' THEN + nw.val
                                    WHEN %L = 'COUNT' THEN + 1
                                END
                            WHEN NOT nw.matches_filter THEN 0
                        END as delta
                FROM ol INNER JOIN nw ON ol.id = nw.id AND ol.ref <> nw.ref
        $$, v_src_ref_col_name, v_src_col_name, v_filter_expr,
            v_src_ref_col_name, v_src_col_name, v_filter_expr,
            v_rollup_type,
            v_rollup_type,
            v_rollup_type,
            v_rollup_type,
            v_rollup_type,
            v_rollup_type
        );
    END IF;

    v_loop_stm := $$
        SELECT id, sum(upd.delta) as delta
        FROM (
            $$ || v_tmp_stm || $$
        ) upd
        GROUP BY id
    $$;

    FOR v_rec IN EXECUTE v_loop_stm
    LOOP
        
        v_stm := format($$ UPDATE %I SET %I = %I + (%s) 
            WHERE id = %L
                AND %I <> %I + (%s)
        $$, v_dst_table_name, v_dst_rollup_col_name, v_dst_rollup_col_name, v_rec.delta, 
                v_rec.id,
                    v_dst_rollup_col_name, v_dst_rollup_col_name, v_rec.delta
        );
        EXECUTE v_stm;
        RAISE NOTICE '% ROLLUP_src_s: %', v_in, TRIM(v_stm);

    END LOOP;

    RETURN NULL; -- result is ignored since this is an AFTER trigger
END;
$fun$ LANGUAGE plpgsql;




--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_rollup_dst_rtrg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_rollup_col_name varchar := TG_ARGV[3];
    v_rollup_type frmdb_put_column_ROLLUP_type := TG_ARGV[4]::frmdb_put_column_ROLLUP_type;
    v_src_ref_col_name varchar := TG_ARGV[5];
    v_filter_expr varchar := TG_ARGV[6];

    v_stm varchar;
    v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
    v_loop_stm varchar;
    v_src_rec RECORD;
BEGIN

    IF (TG_OP = 'DELETE' ) THEN
        RAISE NOTICE '% ROLLUP_dst_r: %', v_in, TG_ARGV;
    ELSIF TG_OP = 'INSERT' THEN
        RAISE NOTICE '% ROLLUP_dst_r: %, %', v_in, TG_ARGV, NEW;

        v_stm := format($$ 
            SELECT %I as id, 
                CASE 
                    WHEN %L = 'SUM' THEN SUM(%I)
                    WHEN %L = 'COUNT' THEN COUNT(%I)
                END as val 
            FROM %I 
            WHERE %I = %L AND (%s)
            GROUP BY %I
        $$, v_src_ref_col_name, 
            v_rollup_type, v_src_col_name, 
            v_rollup_type, v_src_col_name, 
            v_src_table_name, 
            v_src_ref_col_name, NEW.id, v_filter_expr,
            v_src_ref_col_name
        );
        EXECUTE v_stm INTO v_src_rec;

        IF v_src_rec.val IS NULL THEN
            v_src_rec.val := 0;
        END IF;

        NEW := NEW #= hstore(v_dst_rollup_col_name, v_src_rec.val::varchar);  
        RAISE NOTICE '% ROLLUP_dst_r: %.% = % (%).', v_in, v_dst_table_name, v_dst_rollup_col_name, v_src_rec.val, NEW;
        RETURN NEW;
    ELSE --TG_OP = 'UPDATE' THEN
        RETURN NEW;
    END IF;
END;
$fun$ LANGUAGE plpgsql;
