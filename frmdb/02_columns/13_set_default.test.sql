BEGIN;
    SELECT plan( 8 );

    CREATE TABLE test (id varchar NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'test'::name );

    SELECT frmdb_set_column('test', 'col', 'integer');
    SELECT has_column( 'test', 'col' );

    SELECT results_eq(
        $$ SELECT frmdb_set_default('test', 'col', '123') $$,
        $$ VALUES (true) $$, ''
    );
    SELECT col_default_is( 'public', 'test', 'col', 123, '' );
    SELECT results_eq(
        $$ SELECT frmdb_set_default('test', 'col', '123') $$,
        $$ VALUES (false) $$
    );

    SELECT results_eq(
        $$ SELECT frmdb_set_default('test', 'col', '456') $$,
        $$ VALUES (true) $$
    );
    SELECT col_default_is( 'public', 'test', 'col', 456, '' );
    SELECT results_eq(
        $$ SELECT frmdb_set_default('test', 'col', '456') $$,
        $$ VALUES (false) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
