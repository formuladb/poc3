CREATE OR REPLACE VIEW frmdb_resources_fiels AS

    --Tables and Regular Views
    SELECT
        table_schema::varchar as c_table_schema, --1
        table_name::regclass as c_table_name, --2
        column_name::varchar as c_column_name, --3
        data_type::varchar as c_data_type, --4
        COALESCE(
            frmdb_get_check(table_name::regclass, column_name::varchar),
            CASE is_nullable WHEN 'NO' THEN ('is_not_null(' || column_name || ')') ELSE NULL END
        ) as c_check, --5
        column_default::varchar as c_default, --6
        col_description((table_schema || '."' || table_name || '"')::regclass, ordinal_position)::varchar as c_column_description, --7
        is_updatable::boolean as c_is_updatable, --8
        frmdb_get_reference_to(table_name::regclass, column_name::varchar) as c_reference_to, --9
        CASE 
            WHEN is_generated = 'ALWAYS' THEN generation_expression::varchar 
            ELSE frmdb_get_complex_formulas(table_name::regclass, column_name::varchar)::varchar
        END as c_formula, --10
        ordinal_position as c_idx --11
    FROM information_schema.columns
    WHERE table_schema = 'public' -- this needs fixing for schema based multi-tenancy
    
    UNION ALL

    --Materialized Views
    SELECT 
        s.nspname::varchar as c_table_schema, --1
        t.relname::regclass as c_table_name, --2
        attname::varchar as c_column_name, --3
        pg_catalog.format_type(a.atttypid, a.atttypmod)::varchar as c_data_type, --4
        CASE 
            WHEN attnotnull::boolean = TRUE THEN 'is_not_null(' || attname || ')'
            ELSE null::varchar
        END as c_check, --5
        null::varchar as c_default, --6
        '' as c_column_description, --7
        false as c_is_updatable, --8
        null::varchar as c_reference_to, --9
        null::varchar as c_formula, --10
        a.attnum as c_idx --11
    FROM pg_attribute a
    JOIN pg_class t on a.attrelid = t.oid
    JOIN pg_namespace s on t.relnamespace = s.oid
    WHERE a.attnum > 0 
    AND NOT a.attisdropped
    AND t.reltype = 31944
    AND s.nspname = 'public' -- this needs fixing for schema based multi-tenancy
    AND (t.relname::name) in (select matviewname from pg_matviews)
;
