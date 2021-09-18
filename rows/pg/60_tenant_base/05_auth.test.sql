BEGIN;
	SELECT plan( 3 );

	SELECT has_table( 'public'::name, 'frmdb_users'::name );
	SELECT col_type_is( 'public', 'frmdb_users', 'id', 'pg_catalog', 'integer', '' );
	SELECT has_column( 'frmdb_users'::name, 'meta_created_at', '' );

    SELECT frmdb_create_role('testrole');
    INSERT INTO frmdb_users (id, username, pass, role)
		VALUES (1, 'user1', 'pass1', 'testrole');
		
    SELECT frmdb_sql_unit_test_login('user1', 'pass1');
    SELECT frmdb_sql_unit_test_logout();

	SELECT * FROM finish();
	SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
