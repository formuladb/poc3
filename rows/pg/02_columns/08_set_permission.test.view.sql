BEGIN;
    SELECT plan( 3 );

    select frmdb_create_role('testrole');

    CREATE TABLE test (id text NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'test'::name );
    CREATE VIEW testv AS SELECT * FROM test;
    GRANT SELECT ON test TO testrole;
    INSERT INTO test VALUES ('a');

    SET ROLE testrole;
    PREPARE my_thrower AS SELECT id FROM testv;
    SELECT throws_ilike(
        'my_thrower',
        '%permission denied for view testv%'
    );    

    RESET role;
    SELECT frmdb_set_permission('testrole', 'testv', 'true', 'false', 'false', 'false');

    SET ROLE testrole;
    SELECT results_eq(
        $$ SELECT id FROM testv $$,
        $$ VALUES ('a') $$
    );

    RESET role;
    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
