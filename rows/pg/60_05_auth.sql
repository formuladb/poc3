SELECT frmdb_put_table('prw_users');
SELECT frmdb_put_column('prw_users', 'username', 'text', 'is_not_null(username)', null);
SELECT frmdb_put_column('prw_users', 'pass', 'character varying', 'is_not_null(pass)', null);
SELECT frmdb_put_column('prw_users', 'prw_role_id', 'regrole', 'is_not_null(prw_role_id)', null);

DO $$
BEGIN
    IF NOT EXISTS ( SELECT * FROM information_schema.constraint_column_usage
        WHERE constraint_name = 'prw_users_username' AND constraint_schema = current_schema() )
    THEN
        ALTER TABLE prw_users ADD CONSTRAINT prw_users_username UNIQUE (username);
    END IF;
END$$; 
--------
DO $migration$
BEGIN
  IF NOT EXISTS(SELECT * FROM information_schema.triggers 
    WHERE event_object_table = 'prw_users' AND trigger_name = 'users_common_trg' AND trigger_schema = current_schema())
  THEN
    CREATE TRIGGER users_common_trg 
      BEFORE UPDATE ON prw_users FOR EACH ROW EXECUTE PROCEDURE frmdb_0_set_common_cols_trg();
  END IF;
END;
$migration$;


--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################

CREATE OR REPLACE FUNCTION frmdb_encrypt_pass_fun(param text) RETURNS text AS $$
  SELECT 'frmdb_encrypted:' || md5(param)
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;
CREATE OR REPLACE FUNCTION frmdb_pass_is_encrypted(param text) RETURNS boolean AS $$
  SELECT starts_with(param, 'frmdb_encrypted:')
$$ LANGUAGE SQL IMMUTABLE PARALLEL SAFE;



CREATE OR REPLACE FUNCTION
frmdb_encrypt_pass() returns trigger as $$
DECLARE
    v_id varchar := (CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END)||'';
BEGIN
  IF frmdb_trg_call_stack_push('frmdb_encrypt_pass', TG_OP, v_id) = FALSE THEN
      RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
  END IF;

  IF (tg_op = 'INSERT' OR NEW.pass <> OLD.pass) AND NOT frmdb_pass_is_encrypted(NEW.pass) then
    NEW.pass =  frmdb_encrypt_pass_fun(NEW.pass);
  END IF;

  PERFORM frmdb_trg_call_stack_pop('frmdb_encrypt_pass', TG_OP, v_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    BEGIN PERFORM frmdb_trg_call_stack_pop('frmdb_encrypt_pass', TG_OP, v_id);
    EXCEPTION WHEN OTHERS THEN RAISE NOTICE '% %', SQLERRM, SQLSTATE; END;
    RAISE;  
end
$$ language plpgsql;


drop trigger if exists encrypt_pass on prw_users;
create trigger encrypt_pass
  before insert or update on prw_users
  for each row
  execute procedure frmdb_encrypt_pass();


--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################


create or replace function
frmdb_get_user(username text, pass text) returns prw_users
  language plpgsql
  as $$
declare
  v_ret prw_users;
begin
  SELECT * INTO v_ret FROM prw_users
   WHERE prw_users.username = frmdb_get_user.username
     AND prw_users.pass = frmdb_encrypt_pass_fun(frmdb_get_user.pass);
  
  RETURN v_ret;
end;
$$;

-- add type
SELECT frmdb_set_type('frmdb_jwt_token', $$
    CREATE TYPE frmdb_jwt_token AS (
      token text
    );
$$);


--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################

-- frmdb_login should be on your exposed schema
create or replace function
frmdb_login(username text, pass text) returns frmdb_jwt_token as $$
declare
  _user prw_users;
  _cookie varchar;
  result frmdb_jwt_token;
begin
  -- check username and password
  _user := frmdb_get_user(username, pass);
  if _user is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  result.token = exts.sign(
      json_build_object(
        'role', _user.prw_role_id,
        'user_id', _user.id,
        'username', _user.username,
        'exp', extract(epoch from now())::integer + 3600
      ), 'asd1238d140dhoicoiqhewodqhed81-312d'
  );

  _cookie := format('[{"set-cookie": "dbrestauth=%s; path=/; HttpOnly; max-age=3600"}]', result.token);
  PERFORM set_config('response.headers', _cookie, true);    
  return result;
end;
$$ language plpgsql security definer;

--#############################################################################
--#############################################################################

create or replace function
frmdb_sql_unit_test_login_anon() returns void as $fun$
declare
  v_stm varchar;
begin
  v_stm := format($$ SET ROLE frmdb_anon $$);
  EXECUTE v_stm;

  PERFORM set_config('request.jwt.claim.user_id', NULL, true);
  PERFORM set_config('request.jwt.claim.username', NULL, true);
  PERFORM set_config('request.jwt.claim.role', 'frmdb_anon', true);
end;
$fun$ language plpgsql;


create or replace function
frmdb_sql_unit_test_login(username text, pass text) returns void as $fun$
declare
  _user prw_users;
  v_stm varchar;
begin
  -- check username and password
  _user := frmdb_get_user(username, pass);
  if _user is null then
    raise invalid_password using message = 'invalid user or password';
  end if;

  v_stm := format($$ SET ROLE %I $$, _user.prw_role_id);
  EXECUTE v_stm;

  PERFORM set_config('request.jwt.claim.user_id', _user.id::text, true);
  PERFORM set_config('request.jwt.claim.username', _user.username, true);
  PERFORM set_config('request.jwt.claim.role', _user.prw_role_id::text, true);
end;
$fun$ language plpgsql;

--#############################################################################
--#############################################################################

create or replace function frmdb_sql_unit_test_logout() returns void as $fun$
declare
  _user prw_users;
  v_stm varchar;
begin
  RESET ROLE;

  PERFORM set_config('request.jwt.claim.user_id', NULL, true);
  PERFORM set_config('request.jwt.claim.username', NULL, true);
  PERFORM set_config('request.jwt.claim.role', NULL, true);
end;
$fun$ language plpgsql;

--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################

create or replace function
frmdb_refresh_token() returns frmdb_jwt_token as $$
declare
  _role name;
  _cookie varchar;
  result frmdb_jwt_token;
begin

  select exts.sign(
      row_to_json(r), 'asd1238d140dhoicoiqhewodqhed81-312d'
    ) as token
    from (
      select current_user as role, 
      (select current_setting('request.jwt.claim.user_id', true)) as user_id,
      (select current_setting('request.jwt.claim.username', true)) as username,
      extract(epoch from now())::integer + 3600 as exp
    ) r
    into result;
  _cookie := format('[{"set-cookie": "dbrestauth=%s; path=/; HttpOnly; max-age=3600"}]', result.token);
  PERFORM set_config('response.headers', _cookie, true);    
  return result;
end;
$$ language plpgsql;

--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################

create or replace function
frmdb_logout() returns varchar as $fun$
declare
  v_stm varchar;
begin

  v_stm := format($$ SET ROLE frmdb_anon $$);
  EXECUTE v_stm;
  PERFORM set_config('request.jwt.claim.user_id', NULL, true);
  PERFORM set_config('request.jwt.claim.username', NULL, true);

  RETURN frmdb_refresh_token();

end;
$fun$ language plpgsql;



create or replace function
whoami() returns varchar as $$
begin
  return (select current_user) || ':' || (select current_setting('request.jwt.claim.username', true));
end;
$$ language plpgsql;


--#############################################################################
--#############################################################################
--#############################################################################
--#############################################################################

-- the names "frmdb_anon" and "authenticator" are configurable and not
-- sacred, we simply choose them for clarity
DO
$do$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE  rolname = 'frmdb_anon') THEN
      create role frmdb_anon noinherit;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE  rolname = 'authenticator') THEN
      create role authenticator noinherit;
      grant frmdb_anon to authenticator;
  END IF;
END
$do$;

grant execute on function frmdb_login(text,text) to frmdb_anon;
