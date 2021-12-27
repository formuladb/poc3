CREATE OR REPLACE VIEW prw_permissions AS
WITH tmp AS (
    SELECT 
        rtg.grantee || '/' || rtg.table_name as id,
        rtg.grantee as prw_role_id, 
        rtg.table_name as prw_table_id,
        (COUNT(*) FILTER 
                (WHERE rtg.privilege_type = 'SELECT')
            ) > 0 as base_select_perm,
        (COUNT(*) FILTER 
                (WHERE rtg.privilege_type = 'INSERT')
            ) > 0 as base_insert_perm,
        (COUNT(*) FILTER 
                (WHERE rtg.privilege_type = 'UPDATE')
            ) > 0 as base_update_perm,
        (COUNT(*) FILTER 
                (WHERE rtg.privilege_type = 'DELETE')
            ) > 0 as base_delete_perm,
        MIN(pol.qual) FILTER (WHERE pol.cmd = 'SELECT') as select_perm,
        MIN(pol.with_check) FILTER (WHERE pol.cmd = 'INSERT') as insert_perm,
        MIN(pol.with_check) FILTER (WHERE pol.cmd = 'UPDATE') as update_perm,
        MIN(pol.qual) FILTER (WHERE pol.cmd = 'DELETE') as delete_perm
    FROM information_schema.role_table_grants rtg
        LEFT OUTER JOIN pg_policies pol 
            ON rtg.grantee::name = pol.roles[1] 
                AND rtg.table_name::name = pol.tablename
                AND rtg.table_schema::name = pol.schemaname
                AND rtg.privilege_type = pol.cmd
    GROUP BY grantee, table_name
) 
SELECT 
    tmp.id::text collate "C",
    tmp.prw_role_id::text collate "C",
    tmp.prw_table_id::text collate "C",
    CASE WHEN tmp.base_select_perm = TRUE THEN tmp.select_perm::text collate "C" ELSE 'false' END as select_perm,
    CASE WHEN tmp.base_insert_perm = TRUE THEN tmp.insert_perm::text collate "C" ELSE 'false' END as insert_perm,
    CASE WHEN tmp.base_update_perm = TRUE THEN tmp.update_perm::text collate "C" ELSE 'false' END as update_perm,
    CASE WHEN tmp.base_delete_perm = TRUE THEN tmp.delete_perm::text collate "C" ELSE 'false' END as delete_perm
FROM tmp
;


CREATE OR REPLACE FUNCTION prw_permissions_set()
  RETURNS trigger AS
$func$
BEGIN
   PERFORM frmdb_set_permission(
        NEW.prw_role_id,
        NEW.prw_table_id,
        NEW.select_perm,
        NEW.insert_perm,
        NEW.update_perm,
        NEW.delete_perm
    );

   RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS(SELECT *
    FROM information_schema.triggers
    WHERE event_object_table = 'prw_permissions'
    AND trigger_name = 'view_insert'
    AND trigger_schema = current_schema()
  )
  THEN
    CREATE TRIGGER view_insert
      INSTEAD OF INSERT OR UPDATE ON prw_permissions
      FOR EACH ROW
      EXECUTE FUNCTION prw_permissions_set();
  END IF;
END;
$$
