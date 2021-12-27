BEGIN;
    SELECT plan( 5 );

    select frmdb_create_role('testrole');

    CREATE TABLE testparent (id integer NOT NULL PRIMARY KEY, username text);
    SELECT has_table( 'testparent'::name );
    CREATE TABLE test (id text NOT NULL PRIMARY KEY, parent integer references testparent(id));
    SELECT has_table( 'test'::name );

    GRANT SELECT ON test TO testrole;
    GRANT SELECT ON testparent TO testrole;

    INSERT INTO testparent VALUES (1, 'user1');
    INSERT INTO test VALUES ('t1', 1);
    INSERT INTO testparent VALUES (2, 'user2');
    INSERT INTO test VALUES ('t2', 2);

    ALTER TABLE test ENABLE ROW LEVEL SECURITY;
    SELECT frmdb_set_permission('testrole', 'test', 
        $$frmdb_is_owner(hlookup('testparent', parent, 'username'))$$, 'false', 'false', 'false');
    SET ROLE testrole;

    SELECT set_config('request.jwt.claim.username', 'user1', true);
    SELECT results_eq(
        $$ SELECT * FROM test $$::text,
        $$ VALUES ('t1', 1) $$::text
    );

    SELECT set_config('request.jwt.claim.username', 'user2', true);
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ('t2', 2) $$
    );

    SELECT set_config('request.jwt.claim.username', 'user-na', true);
    SELECT is_empty($$ SELECT * FROM test $$);

    RESET role;
    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
