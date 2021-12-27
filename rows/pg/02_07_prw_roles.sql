CREATE OR REPLACE VIEW prw_roles AS SELECT rolname::text collate "C" as id FROM pg_roles;

CREATE OR REPLACE FUNCTION prw_roles_set()
  RETURNS trigger AS
$func$
BEGIN
   PERFORM frmdb_create_role(NEW.id);

   RETURN NEW;
END
$func$  LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS(SELECT *
    FROM information_schema.triggers
    WHERE event_object_table = 'prw_roles'
    AND trigger_name = 'view_insert'
    AND trigger_schema = current_schema()
  )
  THEN
    CREATE TRIGGER view_insert
      INSTEAD OF INSERT OR UPDATE ON prw_roles
      FOR EACH ROW
      EXECUTE FUNCTION prw_roles_set();
  END IF;
END;
$$
