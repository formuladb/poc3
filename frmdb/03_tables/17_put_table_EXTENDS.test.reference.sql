BEGIN;
    SELECT plan( 12 );

    CREATE TABLE ref_tbl (id serial PRIMARY KEY);

    CREATE TABLE src_tbl (id serial PRIMARY KEY);
    SELECT has_table( 'src_tbl'::name );
    SELECT frmdb_put_column_REFERENCE_TO('src_tbl', 'ref', 'ref_tbl', null, null);
    SELECT has_column( 'src_tbl'::name, 'ref' );

    SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns
        WHERE table_name = 'src_tbl';

    SELECT frmdb_put_table_extends('dst_tbl', 'src_tbl', '{"ref"}'::varchar[]);
    SELECT has_table( 'public'::name, 'dst_tbl'::name );
    SELECT has_column( 'dst_tbl'::name, 'ref', '' );
    SELECT has_column( 'dst_tbl'::name, 'created_at', '' );
    SELECT results_eq(
        $$ SELECT frmdb_get_reference_to('dst_tbl', 'ref') $$,
        $$ VALUES ( 'ref_tbl'::varchar ) $$
    );

    SELECT tgname FROM pg_trigger;
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sdt', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sit', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sut', '' );
    SELECT has_trigger( 'dst_tbl', '__dst_tbl__id__dt', '' );

    INSERT INTO ref_tbl (id) VALUES (1);
    INSERT INTO dst_tbl (ref) VALUES (1);
    SELECT * FROM dst_tbl;
    SELECT * FROM src_tbl;
    SELECT results_eq(
        $$ SELECT id, ref FROM src_tbl $$,
        $$ VALUES ( 1, 1 ) $$
    );

    PREPARE my_thrower AS INSERT INTO dst_tbl (ref) VALUES (2);
    SELECT throws_ilike(
        'my_thrower',
        '%violates foreign key constraint "src_tbl__ref__fk"'
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
