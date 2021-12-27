
--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
DO $migration$ BEGIN
    CREATE OR REPLACE FUNCTION frmdb_put_column_HLOOKUP(
        p_table_name regclass, 
        p_col_name varchar,
        p_ref_col_name varchar,
        p_target_col_name varchar
    ) RETURNS boolean AS $fun$ 
    DECLARE
        v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
        v_stm varchar;
        v_col_type varchar;
        v_constraint_name varchar;
        v_ref_table_name varchar;
    BEGIN
        v_constraint_name := frmdb_reference_to_constraint_name(p_table_name, p_ref_col_name);
        SELECT
            ccu.table_name AS foreign_table_name
        INTO v_ref_table_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
        WHERE 
            tc.constraint_type = 'FOREIGN KEY' 
            AND tc.constraint_name =  v_constraint_name
            AND tc.constraint_schema = current_schema()
        ;

        IF v_ref_table_name IS NULL THEN
            RAISE EXCEPTION 'frmdb_put_column_HLOOKUP: cannot find table referenced by %.% (constraint %)', p_table_name, p_ref_col_name, v_constraint_name;
        END IF;
        RAISE NOTICE '% frmdb_put_column_HLOOKUP: %.% = HLOOKUP(%, %) ref table % installing...', v_in, p_table_name, p_col_name, p_ref_col_name, p_target_col_name, v_ref_table_name;

        SELECT CASE
                    WHEN data_type = 'USER-DEFINED' THEN udt_name::varchar
                    ELSE data_type::varchar
                END INTO v_col_type
            FROM information_schema.columns
                WHERE table_name = v_ref_table_name 
                    AND column_name = p_target_col_name	
                    AND table_schema = current_schema()
        ;
        
        IF v_col_type IS NULL THEN
            RAISE EXCEPTION 'frmdb_put_column_HLOOKUP: %.% = HLOOKUP(%, %) cannot find type for %.%', p_table_name, p_col_name, p_ref_col_name, p_target_col_name, v_ref_table_name, p_target_col_name;
        END IF;
        RAISE NOTICE '% frmdb_put_column_HLOOKUP: %.% = HLOOKUP(%, %) with %.% of type %.', v_in, p_table_name, p_col_name, p_ref_col_name, p_target_col_name, v_ref_table_name, p_target_col_name, v_col_type;

        PERFORM frmdb_set_column(p_table_name, p_col_name, v_col_type);
        PERFORM frmdb_set_formula_row_trigger_on_dst(
            '10', --p_prefix --before ROLLUP/VLOOKUP
            'BEFORE',
            'frmdb_hlookup_dst_rtrg'::regproc, --p_trigger_function_name
            v_ref_table_name::regclass,        --p_src_table_name
            p_target_col_name,                 --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_ref_col_name]              --p_args
        );
        PERFORM frmdb_set_formula_row_trigger_on_dst(
            '75', --p_prefix --again after ROLLUP/VLOOKUP
            'BEFORE',
            'frmdb_hlookup_dst_rtrg'::regproc, --p_trigger_function_name
            v_ref_table_name::regclass,        --p_src_table_name
            p_target_col_name,                 --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_ref_col_name]              --p_args
        );
        PERFORM frmdb_set_formula_statement_trigger_on_src(
            '', --p_prefix
            'frmdb_hlookup_src_strg'::regproc, --p_trigger_function_name
            v_ref_table_name::regclass,        --p_src_table_name
            p_target_col_name,                 --p_src_col_name
            p_table_name::regclass,            --p_dst_table_name
            p_col_name,                        --p_dst_col_name
            ARRAY[p_ref_col_name]              --p_args
        );

        RETURN true;
    END; $fun$ language 'plpgsql';
END;
$migration$;

--####################################################################################
--####################################################################################
-- Formula: 
-- HLOOKUP(column_name_reference_to_another_table, value_column_from_referenced_table)
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_hlookup_src_strg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_dst_ref_col_name varchar := TG_ARGV[4];

    v_in varchar := 'HLOOKUP[' || pg_backend_pid()|| ':' || TG_NAME || '] ' || REPEAT('> ', pg_trigger_depth());
    v_stm varchar;
    v_loop_stm varchar;
    v_rec RECORD;
BEGIN
    PERFORM set_config('frmdb_hlookup_trg.src', v_src_table_name::text, true);
    BEGIN
        RAISE NOTICE '%: %', v_in, TG_ARGV;

        IF TG_OP = 'DELETE' THEN
            NULL; --nothing
        ELSE -- TG_OP = 'UPDATE' OR TG_OP = 'INSERT' THEN
            v_loop_stm := format($$ 
                SELECT id, %I AS src_col_value FROM new_table $$, 
                v_src_col_name);

            FOR v_rec IN EXECUTE v_loop_stm
            LOOP
                
                v_stm := format($$ UPDATE %I SET %I = %L 
                    WHERE %I = %L 
                        AND %I IS DISTINCT FROM %L
                $$, v_dst_table_name, v_dst_col_name, v_rec.src_col_value,
                    v_dst_ref_col_name, v_rec.id,
                    v_dst_col_name, v_rec.src_col_value);
                EXECUTE v_stm;
                RAISE NOTICE '%: %', v_in, v_stm;

            END LOOP;
        END IF;

        PERFORM set_config('frmdb_hlookup_trg.src', '', true);
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    EXCEPTION WHEN others THEN
        RAISE NOTICE '% %', SQLERRM, SQLSTATE;
    END;
    PERFORM set_config('frmdb_hlookup_trg.src', '', true);
END;
$fun$ LANGUAGE plpgsql;




--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_hlookup_dst_rtrg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_dst_ref_col_name varchar := TG_ARGV[4];

    v_in varchar := 'HLOOKUP[' || pg_backend_pid() || ':' || TG_NAME || '] ' || REPEAT('> ', pg_trigger_depth());
    v_stm varchar;
    v_loop_stm varchar;
    v_dst_h hstore := hstore(NEW);
    v_src_rec RECORD;
BEGIN
    BEGIN

        RAISE NOTICE '%: %', v_in, TG_ARGV;

        IF (TG_OP = 'DELETE' ) THEN
            RETURN OLD;
        ELSE --(TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
            IF current_setting('frmdb_hlookup_trg.src', true) = v_src_table_name::text THEN RETURN NEW; END IF;
            PERFORM set_config('frmdb_hlookup_trg.src', v_src_table_name::text, true);

            v_stm := format($$ 
                SELECT id, %I as src_col_value FROM %I 
                    WHERE id = %L
            $$, v_src_col_name, v_src_table_name, 
                    v_dst_h->v_dst_ref_col_name);
            EXECUTE v_stm INTO v_src_rec;

            RAISE NOTICE '%: %', v_in, v_stm;

            PERFORM set_config('frmdb_hlookup_trg.src', '', true);
            RETURN NEW #= hstore(v_dst_col_name, v_src_rec.src_col_value::text);  
        END IF;
    EXCEPTION WHEN others THEN
        PERFORM set_config('frmdb_hlookup_trg.src', '', true);
        RAISE;
    END;
END;
$fun$ LANGUAGE plpgsql;
