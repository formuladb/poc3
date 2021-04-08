CREATE OR REPLACE FUNCTION frmdb_get_reference_to(
    p_table_name regclass,
    p_col_name varchar
) RETURNS varchar AS $$
    SELECT
        --tc.table_schema, 
        --tc.constraint_name, 
        --tc.table_name, 
        --kcu.column_name, 
        --ccu.table_schema AS foreign_table_schema,
        --ccu.table_name || '.' || ccu.column_name
        ccu.table_name::varchar
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        --AND ccu.table_schema = tc.table_schema --need not necesarily be in the same schema
    WHERE 
        tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = $1::name
        AND kcu.column_name = $2
        -- AND tc.constraint_name =  v_constraint_name
$$ LANGUAGE SQL;
