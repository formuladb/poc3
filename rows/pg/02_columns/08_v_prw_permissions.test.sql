BEGIN;
    SELECT plan( 7 );

    select frmdb_create_role('testrole');

    CREATE TABLE test (id text NOT NULL PRIMARY KEY, username text);
    SELECT has_table( 'public'::name, 'test'::name );
    GRANT SELECT ON test TO testrole;

    INSERT INTO test VALUES ('a', 'user1');
    INSERT INTO test VALUES ('b', 'user2');

    ALTER TABLE test ENABLE ROW LEVEL SECURITY;
    SELECT frmdb_set_permission('testrole', 'test', 'true', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'false');

    SELECT * FROM information_schema.role_table_grants WHERE table_name = 'test';
    SELECT * FROM pg_policy WHERE polrelid = 'test'::regclass::oid;

    SELECT results_eq(
        $$ SELECT * FROM prw_premissions $$,
        $$ VALUES ('testrole', 'test', 'true', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'false') $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
