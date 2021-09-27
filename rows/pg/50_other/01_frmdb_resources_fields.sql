CREATE OR REPLACE VIEW frmdb_resources_fields AS

    WITH info_schema_cols AS (
        SELECT * FROM information_schema.columns
        WHERE table_schema = 'public' -- this needs fixing for schema based multi-tenancy
    ),
    mat_views AS (
        SELECT s.nspname, t.* FROM pg_class t 
            INNER JOIN pg_namespace s ON t.relnamespace = s.oid
            INNER JOIN pg_matviews m ON t.relname::name = m.matviewname
        WHERE s.nspname = 'public' -- this needs fixing for schema based multi-tenancy
    )
    --Tables and Regular Views
    SELECT
        table_name::text || '--' || column_name::text as id,
        table_schema::text as c_table_schema, --1
        table_name::text as resource_id, --2
        column_name::text as c_column_name, --3
        data_type::text as c_data_type, --4
        COALESCE(
            frmdb_get_check(table_name::regclass, column_name::text),
            CASE is_nullable WHEN 'NO' THEN ('is_not_null(' || column_name || ')') ELSE NULL END
        ) as c_check, --5
        column_default::text as c_default, --6
        col_description((table_schema || '."' || table_name || '"')::regclass, ordinal_position)::text as c_column_description, --7
        is_updatable::boolean as c_is_updatable, --8
        frmdb_get_reference_to(table_name::regclass, column_name::text) as c_reference_to, --9
        CASE 
            WHEN is_generated = 'ALWAYS' THEN generation_expression::text 
            ELSE frmdb_get_complex_formulas(table_name::regclass, column_name::text)::text
        END as c_formula, --10
        ordinal_position as c_idx --11
    FROM info_schema_cols
    
    UNION ALL

    --Materialized Views
    SELECT 
        t.relname::text || '--' || attname::text as id,
        t.nspname::text as c_table_schema, --1
        t.relname::text as resource_id, --2
        attname::text as c_column_name, --3
        pg_catalog.format_type(a.atttypid, a.atttypmod)::text as c_data_type, --4
        CASE 
            WHEN attnotnull::boolean = TRUE THEN 'is_not_null(' || attname || ')'
            ELSE null::text
        END as c_check, --5
        null::text as c_default, --6
        '' as c_column_description, --7
        false as c_is_updatable, --8
        null::text as c_reference_to, --9
        null::text as c_formula, --10
        a.attnum as c_idx --11
    FROM pg_attribute a
    JOIN mat_views t on a.attrelid = t.oid
    WHERE a.attnum > 0 
    AND NOT a.attisdropped
;
