CREATE EXTENSION IF NOT EXISTS pgtap;
CREATE EXTENSION IF NOT EXISTS hstore;


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
