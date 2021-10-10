CREATE OR REPLACE FUNCTION PKEY(param1 anynonarray, param2 anynonarray, param3 anynonarray default null) RETURNS boolean AS $$
  SELECT param1 || '--' || param2 || CASE WHEN param3 IS NOT NULL THEN '--' || param3 ELSE '' END
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;
