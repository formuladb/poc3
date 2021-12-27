CREATE OR REPLACE PROCEDURE frmdb_internal_migrate_function(p_name text, p_src text)
AS $MIGR$
DECLARE
	v_prev_count integer;
	v_after_count integer;
	v_rec RECORD;
BEGIN
	CREATE LOCAL TEMPORARY TABLE existing_func_oids ON COMMIT DROP AS 
		SELECT p.oid 
			FROM pg_catalog.pg_proc p
			INNER JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
			WHERE p.proname = p_name
				AND n.nspname = current_schema()
	;
	SELECT count(*) INTO v_prev_count FROM existing_func_oids;

    EXECUTE p_src; 
	
	SELECT count(*) INTO v_after_count 
		FROM pg_catalog.pg_proc p
		INNER JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
		WHERE p.proname = p_name
				AND n.nspname = current_schema()
	;
	
	IF v_after_count > v_prev_count THEN
		FOR v_rec IN SELECT oid FROM existing_func_oids
		LOOP
			EXECUTE 'DROP FUNCTION ' || v_rec.oid::regprocedure;
		END LOOP;
	END IF;
	
END
$MIGR$ LANGUAGE plpgsql;
