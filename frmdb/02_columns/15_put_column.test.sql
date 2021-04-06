BEGIN;
    SELECT plan( 10 );

    CREATE TABLE test (id varchar NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'test'::name );

    SELECT frmdb_put_column('test', 'nb', 'integer', null, null);
    SELECT has_column( 'test', 'nb' );
    SELECT col_type_is( 'public', 'test', 'nb', 'pg_catalog', 'integer', 'check-type' );

    SELECT frmdb_put_column('test', 'nb', 'character varying(20)', null, null);
    SELECT has_column( 'test', 'nb' );
    SELECT col_type_is( 'public', 'test', 'nb', 'pg_catalog', 'character varying(20)', 'check-type' );

    SELECT frmdb_put_column('test', 'nb', 'numeric(5,2)', null, null);
    SELECT has_column( 'test', 'nb' );
    SELECT col_type_is( 'public', 'test', 'nb', 'pg_catalog', 'numeric(5,2)', 'check-type' );

    SELECT frmdb_put_column('test', 'enumcol', 'text', 'enumcol ~* ''A|B''', null);
    SELECT has_column( 'test', 'enumcol' );
    SELECT col_type_is( 'public', 'test', 'enumcol', 'pg_catalog', 'text', 'check-type' );
    PREPARE my_thrower AS INSERT INTO test (id, enumcol) VALUES (1, 'C');
    SELECT throws_ilike(
        'my_thrower',
        '%violates check constraint "test__enumcol__ck"'
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
