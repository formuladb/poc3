CREATE OR REPLACE VIEW prw_table_columns AS

    WITH info_schema_cols AS (
        SELECT * FROM information_schema.columns
        WHERE table_schema = current_schema()
    ),
    mat_views AS (
        SELECT s.nspname, t.* FROM pg_class t 
            INNER JOIN pg_namespace s ON t.relnamespace = s.oid
            INNER JOIN pg_matviews m ON t.relname::name = m.matviewname
        WHERE s.nspname = current_schema()
    )
    --Tables and Regular Views
    SELECT
        table_name::text || '--' || column_name::text as id,
        table_schema::text as c_table_schema, --1
        table_name::text as prw_table_id, --2
        column_name::text as c_column_name, --3
        data_type::text as c_data_type, --4
        COALESCE(
            frmdb_get_check(table_name::regclass, column_name::text),
            CASE is_nullable WHEN 'NO' THEN ('is_not_null(' || column_name || ')') ELSE NULL END
        ) as c_check, --5
        column_default::text as c_default, --6
        col_description((table_schema || '."' || table_name || '"')::regclass, ordinal_position)::text as c_column_description, --7
        is_updatable::boolean as c_is_updatable, --8
        CASE 
            WHEN is_generated = 'ALWAYS' THEN generation_expression::text 
            WHEN frmdb_get_reference_to(table_name::regclass, column_name::text) IS NOT NULL THEN 
                $f$ REFERENCE_TO($f$ || 
                    frmdb_get_reference_to(table_name::regclass, column_name::text) || 
                $f$, $f$ || frmdb_get_reference_delete_rule(table_name::text, column_name::text) || $f$) $f$
            ELSE frmdb_get_complex_formulas(table_name::regclass, column_name::text)::text
        END as c_formula, --10
        ordinal_position as c_idx --11
    FROM info_schema_cols
    
    UNION ALL

    --Materialized Views
    SELECT 
        t.relname::text || '--' || attname::text as id,
        t.nspname::text as c_table_schema, --1
        t.relname::text as prw_table_id, --2
        attname::text as c_column_name, --3
        pg_catalog.format_type(a.atttypid, a.atttypmod)::text as c_data_type, --4
        CASE 
            WHEN attnotnull::boolean = TRUE THEN 'is_not_null(' || attname || ')'
            ELSE null::text
        END as c_check, --5
        null::text as c_default, --6
        '' as c_column_description, --7
        false as c_is_updatable, --8
        null::text as c_formula, --10
        a.attnum as c_idx --11
    FROM pg_attribute a
    JOIN mat_views t on a.attrelid = t.oid
    WHERE a.attnum > 0 
    AND NOT a.attisdropped
;

CALL frmdb_internal_migrate_function('prw_table_columns_cud', $MIGR$
    CREATE OR REPLACE FUNCTION prw_table_columns_cud() RETURNS trigger AS
    $func$
    DECLARE
        v_stm varchar;
        v_str_arr varchar[];    
    BEGIN
        IF (TG_OP = 'DELETE' ) THEN
            v_stm := format($$ ALTER TABLE %I DROP COLUMN %I $$, 
                OLD.prw_table_id, OLD.c_column_name);
            EXECUTE v_stm;
            RAISE NOTICE 'prw_table_columns_cud: %', v_stm;    
        ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE')  THEN

            IF NEW.c_formula ~ '^REFERENCE_TO' THEN
                v_str_arr := regexp_matches(NEW.c_formula, 'REFERENCE_TO[(](.*?), (.*?)[)]');
                PERFORM frmdb_put_column_REFERENCE_TO(
                    NEW.prw_table_id, 
                    NEW.c_column_name,
                    v_str_arr[1], -- p_ref_table_name
                    NEW.c_check,
                    NEW.c_default,
                    v_str_arr[2] -- p_on_delete
                );
            ELSIF NEW.c_formula ~ '^ROLLUP' THEN
                v_str_arr := regexp_matches(NEW.c_formula, 'ROLLUP[(](.*?), (.*?), (.*?), (.*?), (.*?)[)]');
                PERFORM frmdb_put_column_ROLLUP(
                    NEW.prw_table_id, 
                    NEW.c_column_name,
                    v_str_arr[1], -- p_src_table
                    v_str_arr[2], -- p_src_rollup_col_name
                    v_str_arr[3], -- p_rollup_type
                    v_str_arr[4], -- p_src_ref_col_name
                    v_str_arr[5]  -- p_filter_expr
                );

            ELSIF NEW.c_formula ~ '^HLOOKUP' THEN
                v_str_arr := regexp_matches(NEW.c_formula, 'HLOOKUP[(](.*?), (.*?)[)]');

                PERFORM frmdb_put_column_HLOOKUP(
                    NEW.prw_table_id, 
                    NEW.c_column_name,
                    v_str_arr[1], -- p_ref_col_name varchar,
                    v_str_arr[2]  -- p_target_col_name varchar
                );
            ELSIF NEW.c_formula ~ '^VLOOKUP' THEN
                v_str_arr := regexp_matches(NEW.c_formula, 'VLOOKUP[(](.*?), (.*?), (.*?), (.*?), (.*?)[)]');

                PERFORM frmdb_put_column_VLOOKUP(
                    NEW.prw_table_id, 
                    NEW.c_column_name,
                    v_str_arr[1], -- p_src_table regclass,
                    v_str_arr[2], -- p_src_vlookup_col_name varchar,
                    v_str_arr[3], -- p_dst_join_col_name varchar,
                    v_str_arr[4], -- p_src_join_col_name varchar,
                    v_str_arr[5]  -- p_filter_expr varchar
                );

            ELSE
                PERFORM frmdb_put_column(
                    NEW.prw_table_id, 
                    NEW.c_column_name,
                    NEW.c_data_type,
                    NEW.c_check,
                    NEW.c_default,
                    NEW.c_formula
                );

            END IF;

            RETURN NEW;
        END IF;
    END;
    $func$ LANGUAGE plpgsql;
$MIGR$);

SELECT frmdb_set_trigger('prw_table_columns_cud_trg', 'prw_table_columns', $MIGR$
    CREATE TRIGGER prw_table_columns_cud_trg
    INSTEAD OF INSERT OR UPDATE OR DELETE ON prw_table_columns
    FOR EACH ROW
    EXECUTE PROCEDURE prw_table_columns_cud();
$MIGR$);
