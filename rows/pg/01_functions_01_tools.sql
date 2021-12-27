DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'frmdb_table_name_t') THEN
        CREATE TYPE frmdb_table_name_t AS (schname varchar, tblname varchar);
    END IF;
END$$;


CREATE OR REPLACE FUNCTION frmdb_parse_table_name(p_table_name varchar) RETURNS frmdb_table_name_t AS 
$fun$ 
DECLARE 
    v_parsed_formula varchar[];
    v_ret frmdb_table_name_t;
BEGIN 
    SELECT current_schema() INTO v_ret.schname;
    v_ret.tblname := p_table_name;

    IF p_table_name ~ '^(\w+)\.(\w+)$' THEN
        v_parsed_formula := regexp_matches(p_table_name, '^(\w+)\.(\w+)$');
        v_ret.schname := v_parsed_formula[1];
        v_ret.tblname := v_parsed_formula[2];
    END IF;

    RETURN v_ret;
END; 
$fun$ language 'plpgsql';
