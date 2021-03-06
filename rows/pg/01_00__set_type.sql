CREATE OR REPLACE FUNCTION frmdb_set_type(p_name text, p_src text)
RETURNS boolean AS $MIGR$
DECLARE
	v_txt text;
    v_to_add boolean := false;
BEGIN
	IF NOT EXISTS (
        SELECT      n.nspname as schema, t.typname as type 
            FROM        pg_type t 
            LEFT JOIN   pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
            WHERE       (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid)) 
            AND     NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
            AND     n.nspname NOT IN ('pg_catalog', 'information_schema')
            AND     t.typname = p_name
            AND     n.nspname = current_schema()
    ) THEN
		--TODO replace type if definition has changed
	    EXECUTE p_src; 
        v_to_add := true;
	END IF;

    RETURN v_to_add;
END
$MIGR$ LANGUAGE plpgsql;
