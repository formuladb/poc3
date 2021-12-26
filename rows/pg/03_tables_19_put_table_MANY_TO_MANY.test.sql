BEGIN;
    SELECT plan( 9 );

    SELECT set_config('request.jwt.claim.tenant', 'pagerows', true);

    CREATE TABLE test1 (id varchar NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'test1'::name );
    CREATE TABLE test2 (id serial NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'test2'::name );

    SELECT frmdb_put_table_MANY2MANY('test', 'test1', 'test2');
    SELECT has_table( 'public'::name, 'test'::name );
    SELECT fk_ok( 'public', 'test', 'test1__id', 'public', 'test1', 'id' );
    SELECT has_column( 'test'::name, 'test1__id' );
    SELECT fk_ok( 'public', 'test', 'test2__id', 'public', 'test2', 'id' );
    SELECT has_column( 'test'::name, 'meta_created_at', '' );

    INSERT INTO test1 (id) VALUES ('a'), ('b');
    INSERT INTO test2 (id) VALUES (1), (2);
    INSERT INTO test (test1__id, test2__id) VALUES ('a', 1);
    SELECT results_eq(
        $$ SELECT id FROM test $$,
        $$ VALUES ( 'a--1'::varchar ) $$
    );

    UPDATE test SET test1__id = 'b' WHERE id = 'a--1';
    INSERT INTO test (test1__id, test2__id) VALUES ('a', 2);
    SELECT results_eq(
        $$ SELECT id FROM test $$,
        $$ VALUES ( 'b--1'::varchar ), ( 'a--2'::varchar ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
