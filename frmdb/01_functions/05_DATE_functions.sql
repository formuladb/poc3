CREATE OR REPLACE FUNCTION EOMONTH(param date) RETURNS date AS $$
  SELECT (date_trunc('month', $1) + interval '1 month' - interval '1 day')::date
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;
