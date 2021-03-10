--####################################################################################
DO $migration$
BEGIN
    
    CREATE OR REPLACE FUNCTION frmdb_put_table_MANY2MANY (
        p_table_name varchar, 
        p_ref_table1_name regclass,
        p_ref_table2_name regclass
    ) RETURNS void AS $fun$ 
    DECLARE
        v_stm varchar;
        v_col1_type varchar;
        v_col2_type varchar;
        v_col1_name varchar := p_ref_table1_name || '__id';
        v_col2_name varchar := p_ref_table2_name || '__id';
    BEGIN
        RAISE NOTICE 'frmdb_put_table_MANY2MANY: p_table_name=%, p_ref_table1_name=%, p_ref_table2_name=%', p_table_name, p_ref_table1_name, p_ref_table2_name;

        SELECT data_type::varchar INTO v_col1_type
            FROM information_schema.columns WHERE 
                table_name = p_ref_table1_name::name AND column_name = 'id';
        RAISE NOTICE 'frmdb_put_table_MANY2MANY: type of m2m referenced column %.id is %.', p_ref_table1_name, v_col1_type;
        SELECT data_type::varchar INTO v_col2_type
            FROM information_schema.columns WHERE 
                table_name = p_ref_table2_name::name AND column_name = 'id';
        RAISE NOTICE 'frmdb_put_table_MANY2MANY: type of m2m referenced column %.id is %.', p_ref_table2_name, v_col2_type;

        v_stm := format($$ 
            CREATE TABLE IF NOT EXISTS %I (
                id varchar GENERATED ALWAYS AS (
                    %I::varchar || '--' || %I::varchar) STORED,
                %I %s NOT NULL,
                %I %s NOT NULL,
                created_at timestamptz DEFAULT NOW(),
                created_by varchar DEFAULT current_setting('request.jwt.claim.username', true),
                updated_at timestamptz DEFAULT NOW(),
                updated_by varchar DEFAULT current_setting('request.jwt.claim.username', true),
                PRIMARY KEY(id)
            )
        $$, p_table_name, 
            v_col1_name, v_col2_name, 
            v_col1_name, v_col1_type, 
            v_col2_name, v_col2_type
        );
        EXECUTE v_stm;
        RAISE NOTICE 'frmdb_put_table_MANY2MANY: table % created, MANY2MANY(%, %)', p_table_name, p_ref_table1_name, p_ref_table2_name;
        
        v_stm := format($$ 
            ALTER TABLE %I ENABLE ROW LEVEL SECURITY
        $$, p_table_name);
        EXECUTE v_stm;

        PERFORM frmdb_put_column_REFERENCE_TO(p_table_name, v_col1_name, p_ref_table1_name);
        PERFORM frmdb_put_column_REFERENCE_TO(p_table_name, v_col2_name, p_ref_table2_name);

        PERFORM frmdb_install_common_columns_trg(p_table_name);

        PERFORM frmdb_set_formula_row_trigger_on_dst(
            'BEFORE',
            'frmdb_many2many_dst_rtrg'::regproc, --p_trigger_function_name
            p_table_name::regclass,              --p_src_table_name
            'id',                                --p_src_col_name
            p_table_name::regclass,              --p_dst_table_name
            'id',                        --p_dst_col_name
            ARRAY[v_col1_name, v_col2_name]              --p_args
        );

    END; $fun$ language 'plpgsql';
END;
$migration$;



--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_many2many_dst_rtrg() RETURNS TRIGGER AS $fun$
DECLARE
    v_src_table_name regclass := TG_ARGV[0];
    v_src_col_name varchar := TG_ARGV[1];
    v_dst_table_name regclass := TG_ARGV[2];
    v_dst_col_name varchar := TG_ARGV[3];
    v_col1_name varchar := TG_ARGV[4];
    v_col2_name varchar := TG_ARGV[5];

    v_in varchar := '[' || pg_backend_pid() || '] ' || REPEAT('> ', pg_trigger_depth());
    v_stm varchar;
    v_loop_stm varchar;
    v_dst_h hstore := hstore(NEW);
    v_src_rec RECORD;
    v_new_id varchar;
BEGIN
    BEGIN

        RAISE NOTICE '% MANY2MANY_dst_r: %', v_in, TG_ARGV;

        IF (TG_OP = 'UPDATE') THEN
            v_new_id := NEW.id::varchar;
        ELSIF (TG_OP = 'INSERT') THEN
            v_new_id := (v_dst_h->v_col1_name)::varchar || '--' || (v_dst_h->v_col2_name)::varchar;
        END IF;

        IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
            IF OLD.id::varchar <> v_new_id THEN
                v_stm := format($$ 
                    DELETE FROM %I WHERE id = %L
                $$, v_dst_table_name, OLD.id);
                EXECUTE v_stm;
            END IF;
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
    EXCEPTION WHEN others THEN
        PERFORM set_config('frmdb_hlookup_trg.src', '', true);
        RAISE;
    END;
END;
$fun$ LANGUAGE plpgsql;
