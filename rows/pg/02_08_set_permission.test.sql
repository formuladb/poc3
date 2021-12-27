BEGIN;
    SELECT plan( 7 );

    select frmdb_create_role('testrole');

    CREATE TABLE test (id text NOT NULL PRIMARY KEY, username text);
    SELECT has_table( 'test'::name );
    GRANT SELECT ON test TO testrole;

    INSERT INTO test VALUES ('a', 'user1');
    INSERT INTO test VALUES ('b', 'user2');

    ALTER TABLE test ENABLE ROW LEVEL SECURITY;
    SELECT frmdb_set_permission('testrole', 'test', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)');

    SELECT * FROM information_schema.role_table_grants WHERE table_name = 'test';
    SELECT * FROM pg_policy WHERE polrelid = 'test'::regclass::oid;

    SET ROLE testrole;

    SELECT set_config('request.jwt.claim.username', 'user1', true);
    SELECT frmdb_is_owner('user1');
    SELECT frmdb_is_owner('user2');
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ('a', 'user1') $$
    );

    SELECT set_config('request.jwt.claim.username', 'user2', true);
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ('b', 'user2') $$
    );

    SELECT set_config('request.jwt.claim.username', 'user-na', true);
    SELECT is_empty($$ SELECT * FROM test $$);


    RESET ROLE;
    SELECT frmdb_set_permission('testrole', 'test', 'frmdb_is_owner_id(username)', 'false', 'false', 'false');
    SET ROLE testrole;
    SELECT set_config('request.jwt.claim.username', null, true);
    SELECT set_config('request.jwt.claim.user_id', 'user2', true);
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ('b', 'user2') $$
    );


    RESET ROLE;
    SELECT * FROM pg_catalog.pg_policies;
    SELECT frmdb_set_permission('testrole', 'test', 'true', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'false');
    SELECT frmdb_set_permission('testrole', 'test', 'true', 'frmdb_is_owner(username)', 'frmdb_is_owner(username)', 'false');
    SELECT frmdb_set_permission_on_all_tables('testrole', 'true', 'false', 'false', 'false');

    SET ROLE testrole;
    SELECT set_config('request.jwt.claim.username', 'user-na', true);
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ('a', 'user1'), ('b', 'user2') $$
    );

    PREPARE my_thrower AS INSERT INTO test (id, username) VALUES ('c', 'user3');
    SELECT throws_ilike(
        'my_thrower',
        '%new row violates row-level security policy for table "test"'
    );

    RESET role;
    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
