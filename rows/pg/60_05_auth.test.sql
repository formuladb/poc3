BEGIN;
	SELECT plan( 3 );

	SELECT has_table( 'prw_users'::name );
	SELECT col_type_is( current_schema(), 'prw_users', 'id', 'pg_catalog', 'integer', '' );
	SELECT has_column( 'prw_users'::name, 'meta_created_at', '' );

    SELECT frmdb_create_role('testrole');
    INSERT INTO prw_users (id, username, pass, prw_role_id)
		VALUES (11, 'user1', 'pass1', 'testrole');
		
    SELECT frmdb_sql_unit_test_login('user1', 'pass1');
    SELECT frmdb_sql_unit_test_logout();

	SELECT * FROM finish();
	SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
