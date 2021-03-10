DO $migration$
BEGIN
    
	CREATE OR REPLACE FUNCTION hlookup(
		p_parent_table_name regclass,
		p_parent_id anynonarray,
		p_parent_value_col_name varchar
	) RETURNS text AS $fun$
	DECLARE
		v_stm varchar;
		v_ret text;
	BEGIN
		v_stm := format($$ SELECT %I FROM %I WHERE id = %L $$, 
			p_parent_value_col_name, p_parent_table_name, p_parent_id);
        EXECUTE v_stm INTO v_ret;
		return v_ret::text;
	END;
	$fun$ LANGUAGE plpgsql;


	CREATE OR REPLACE FUNCTION hlookup2(
		p_parent_table_name regclass,
		p_parent_id anynonarray,
		p_grandparent_table_name regclass,
		p_ref2grandparent_col_name varchar,
		p_grandparent_value_col_name varchar
	) RETURNS text AS $fun$
	DECLARE
		v_stm varchar;
		v_ret text;
	BEGIN
		v_stm := format($$ 
			SELECT grandparent.%I 
			FROM %I parent 
				INNER JOIN %I grandparent ON grandparent.id = parent.%I
			WHERE parent.id = %L 
		$$, p_grandparent_value_col_name, 
			p_parent_table_name, 
			p_grandparent_table_name, p_ref2grandparent_col_name,
			p_parent_id);
        EXECUTE v_stm INTO v_ret;
		return v_ret::text;
	END;
	$fun$ LANGUAGE plpgsql;
END;
$migration$;
