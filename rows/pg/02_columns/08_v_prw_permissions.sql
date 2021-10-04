CREATE OR REPLACE VIEW pew_permissions AS
SELECT 
    rtg.grantee as prw_role_id, 
    rtg.table_name as prw_table_id,
    (COUNT(*) FILTER 
            (WHERE rtg.privilege_type = 'SELECT' AND rtg.is_grantable = 'YES')
        ) > 0 as select_perm,
    (COUNT(*) FILTER 
            (WHERE rtg.privilege_type = 'INSERT' AND rtg.is_grantable = 'YES')
        ) > 0 as insert_perm,
    (COUNT(*) FILTER 
            (WHERE rtg.privilege_type = 'UPDATE' AND rtg.is_grantable = 'YES')
        ) > 0 as update_perm,
    (COUNT(*) FILTER 
            (WHERE rtg.privilege_type = 'DELETE' AND rtg.is_grantable = 'YES')
        ) > 0 as delete_perm
FROM information_schema.role_table_grants rtg
    LEFT OUTER JOIN pg_policies pol 
        ON rtg.grantee::name = pol.roles[0] AND rtg.table_name = pol.tablename
GROUP BY grantee, table_name
;
