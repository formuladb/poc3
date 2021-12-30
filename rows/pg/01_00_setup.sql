

DO $migration$
DECLARE
  v_sch text := current_schema();
BEGIN
  SET search_path TO exts;
  CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA exts;
  CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA exts;
  CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA exts;
  CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA exts;
  EXECUTE 'SET search_path TO ' || v_sch;
END;
$migration$;
SHOW search_path;

CREATE OR REPLACE FUNCTION frmdb_check_nb_failures() RETURNS void AS 
$fun$ 
DECLARE v integer;
BEGIN 
    SELECT count(*) INTO v FROM finish();
    IF v > 0 THEN 
        RAISE EXCEPTION 'ERRORS %', v;
    END IF;
END; 
$fun$ language 'plpgsql';
