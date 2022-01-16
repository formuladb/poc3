create or replace function public.prw_pre_request() returns void
  language plpgsql
  as $$
declare
	
	_request_id text := coalesce(current_setting('request.headers', true)::json->>'authorization','');
	_role text := coalesce(current_setting('request.jwt.claims', true)::json->>'role','');
	_user_id text := coalesce(current_setting('request.jwt.claims', true)::json->>'user_id','');
	_resource text := coalesce(current_setting('request.header.x-path', true),'');
	_verb text := coalesce(current_setting('request.header.x-verb', true),'');
	_qs_id text := coalesce(current_setting('request.header.x-qs-id', true),'not-set');
	_accept_profile text := coalesce(current_setting('request.header.accept-profile', true),'not-set');
	_content_profile text := coalesce(current_setting('request.header.content-profile', true),'not-set');
	
	_query text;

begin

  	raise log 'PostgREST: [%] JWT claim: (%:%) Resource: %:%; Query args: id=%; Accept-Profile=%; Content-Profile=%', 
  		_request_id,
  		_role,
  		_user_id,
  		_verb,
  		_resource,
  		_qs_id,
        _accept_profile,
        _content_profile;

	-- Create another connection and use it to write the action to a log table:
	
	-- _query := 'insert into audit.requests (user_id,resource,action,role) values ';
	-- _query := _query || '($user_id$, $resource$, $verb$, $role$)';
	-- _query := replace(_query, '$user_id$'::text, quote_literal(_user_id));
	-- _query := replace(_query, '$resource$'::text, quote_literal(lower(_resource)));
	-- _query := replace(_query, '$verb$'::text, quote_literal(lower(_verb)));
	-- _query := replace(_query, '$role$'::text, quote_literal(lower(_role)));

	-- raise notice '%', _query;

	-- PERFORM dblink_connect_u('dblink_audit','dbname=db');
	-- PERFORM dblink('dblink_audit', _query);
	-- PERFORM dblink('dblink_audit','COMMIT;');
	-- PERFORM dblink_disconnect('dblink_audit'); 

end
$$;