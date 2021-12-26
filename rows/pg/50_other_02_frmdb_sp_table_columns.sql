--####################################################################################
--####################################################################################
--####################################################################################
--####################################################################################
CALL frmdb_internal_migrate_function('frmdb_sp_table_columns', $MIGR$
    CREATE OR REPLACE FUNCTION frmdb_sp_table_columns(p_table_name regclass) 
    RETURNS table(
        c_table_schema varchar,                --1
        c_table_name regclass,                 --2
        c_column_name varchar,                 --3
        c_data_type varchar,                   --4
        c_check varchar,                       --5
        c_default varchar,                     --6
        c_column_description varchar,          --7
        c_is_updatable boolean,                --8
        c_reference_to varchar,                --9
        c_formula varchar,                     --10
        c_idx integer                          --11
    ) 
    AS
    $func$
    BEGIN
        SET LOCAL ROLE postgres;--need permissions on constraint_column_usage
        --WARNING: this role will exist for the whole transaction

        RETURN QUERY 
            SELECT * FROM (
                --Tables and Regular Views
                SELECT
                    table_schema::varchar as c_table_schema, --1
                    table_name::regclass as c_table_name, --2
                    column_name::varchar as c_column_name, --3
                    data_type::varchar as c_data_type, --4
                    COALESCE(
                        frmdb_get_check(p_table_name, column_name::varchar),
                        CASE is_nullable WHEN 'NO' THEN ('is_not_null(' || column_name || ')') ELSE NULL END
                    ) as c_check, --5
                    column_default::varchar as c_default, --6
                    col_description((table_schema || '."' || table_name || '"')::regclass, ordinal_position)::varchar as c_column_description, --7
                    is_updatable::boolean as c_is_updatable, --8
                    frmdb_get_reference_to(p_table_name, column_name::varchar) as c_reference_to, --9
                    CASE 
                        WHEN is_generated = 'ALWAYS' THEN generation_expression::varchar 
                        ELSE frmdb_get_complex_formulas(table_name::regclass, column_name::varchar)::varchar
                    END as c_formula, --10
                    ordinal_position as c_idx --11
                FROM information_schema.columns
                WHERE table_name = p_table_name::information_schema.sql_identifier
                
                UNION ALL

                --Materialized Views
                SELECT 
                    s.nspname::varchar as c_table_schema, --1
                    t.relname::regclass as c_table_name, --2
                    attname::varchar as c_column_name, --3
                    pg_catalog.format_type(a.atttypid, a.atttypmod)::varchar as c_data_type, --4
                    CASE 
                        WHEN attnotnull::boolean = TRUE THEN 'is_not_null(' || c_column_name || ')'
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
                AND t.relname = p_table_name::name
                AND s.nspname = 'public'
                AND (p_table_name::name) in (select matviewname from pg_matviews)
            ) tmp
            ORDER BY c_table_schema, c_table_name, c_idx
        ;

    END;
    $func$ LANGUAGE plpgsql;
$MIGR$);
