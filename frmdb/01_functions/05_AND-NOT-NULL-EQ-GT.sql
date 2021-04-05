CREATE OR REPLACE FUNCTION _AND(left boolean, right boolean) RETURNS boolean AS $$
  SELECT $1 AND $2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION _NOT(param boolean) RETURNS boolean AS $$
  SELECT NOT $1
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION IS_NOT_NULL(param anynonarray) RETURNS boolean AS $$
  SELECT $1 IS NOT NULL
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION GT(param1 anynonarray, param2 anynonarray) RETURNS boolean AS $$
  SELECT param1 > param2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION GTE(param1 anynonarray, param2 anynonarray) RETURNS boolean AS $$
  SELECT param1 >= param2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION LT(param1 anynonarray, param2 anynonarray) RETURNS boolean AS $$
  SELECT param1 < param2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION LTE(param1 anynonarray, param2 anynonarray) RETURNS boolean AS $$
  SELECT param1 <= param2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION EQ(param1 anynonarray, param2 anynonarray) RETURNS boolean AS $$
  SELECT param1 = param2
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION IS_TRUE(arg boolean) RETURNS boolean AS $$
  SELECT $1
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION CONCATENATE(args VARIADIC text[]) RETURNS text AS $$
  SELECT CONCAT(VARIADIC args)
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION H2INT(text) RETURNS integer AS $$
  SELECT ('x'||substr(md5($1),1,8))::bit(32)::int;
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION MATCH(param text, regex text) RETURNS boolean AS $$
  SELECT param ~* regex
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION IS_ENUM(param text, enum_values VARIADIC text[]) RETURNS boolean AS $$
  SELECT param = ANY(enum_values)
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION IFS(
  test1 boolean, value1 text, 
  text2 boolean default null, value2 text default null,
  text3 boolean default null, value3 text default null,
  text4 boolean default null, value4 text default null,
  text5 boolean default null, value5 text default null
) RETURNS text AS $$
  SELECT CASE
    WHEN test1 THEN value1
    WHEN test2 THEN value2
    WHEN test3 THEN value3
    WHEN test4 THEN value4
    WHEN test5 THEN value5
  END
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;
