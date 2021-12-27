BEGIN;
    SELECT plan( 16 );

    CREATE TABLE test (id text NOT NULL PRIMARY KEY);
    SELECT has_table( 'test'::name );

    INSERT INTO test VALUES ('a');

    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', 'text') $$,
        $$ VALUES (true) $$
    );
    SELECT col_type_is( 'test', 'tst', 'text', 'check-type' );
    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', 'text') $$,
        $$ VALUES (false) $$
    );
    SELECT has_column( 'test'::name, 'tst' );
    UPDATE test SET tst = '123' where id = 'a';

    SELECT frmdb_set_column('test', 'tst', 'numeric');
    -- SELECT col_type_is( "schema" := null, "table" := 'test', "column" := 'tst', "type_schema" := 'pg_catalog', "type" := 'numeric', "description" := 'check-type' );
    SELECT col_type_is( current_schema(), 'test', 'tst', 'pg_catalog', 'numeric', 'check-type' );
    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', 'numeric') $$,
        $$ VALUES (false) $$, 'numeric'
    );

    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', ' integer ') $$,
        $$ VALUES (true) $$
    );
    SELECT col_type_is( current_schema(), 'test', 'tst', 'pg_catalog', 'integer', 'check-type' );
    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', 'integer') $$,
        $$ VALUES (false) $$
    );
    
    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst', ' integer', 'length(id)') $$,
        $$ VALUES (true) $$
    );
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ( 'a', 1 ) $$
    );

    
    SELECT results_eq(
        $$ SELECT frmdb_set_column('test', 'tst2', ' integer', 'length(id)') $$,
        $$ VALUES (true) $$
    );
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ( 'a', 1, 1 ) $$
    );

    SELECT frmdb_set_column('test', 'txt', 'text', '''default-value''');
    SELECT col_type_is( current_schema(), 'test', 'txt', 'pg_catalog', 'text', 'check-type' );
    SELECT results_eq(
        $$ SELECT * FROM test $$,
        $$ VALUES ( 'a', 1, 1, 'default-value' ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
