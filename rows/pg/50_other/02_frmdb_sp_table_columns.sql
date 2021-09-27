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
            SELECT * FROM frmdb_resources_fiels rf
            WHERE rf.c_table_name = p_table_name::regclass
            ORDER BY rf.c_table_schema, rf.c_table_name, rf.c_idx
        ;

    END;
    $func$ LANGUAGE plpgsql;
$MIGR$);
