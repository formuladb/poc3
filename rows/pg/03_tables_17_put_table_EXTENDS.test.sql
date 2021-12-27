BEGIN;
    SELECT plan( 20 );

    SELECT set_config('request.jwt.claim.tenant', 'pagerows', true);

    CREATE TABLE src_tbl (id serial PRIMARY KEY, src_col varchar);
    SELECT has_table( 'src_tbl'::name );
    SELECT has_column( 'src_tbl'::name, 'src_col'::name );

    SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns
        WHERE table_name = 'src_tbl';

    SELECT frmdb_put_table_extends('dst_tbl', 'src_tbl', '{"src_col"}'::varchar[]);
    SELECT has_table( 'dst_tbl'::name );
    SELECT has_column( 'dst_tbl'::name, 'src_col', '' );
    SELECT has_column( 'dst_tbl'::name, 'meta_created_at', '' );

    SELECT tgname FROM pg_trigger;
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sdt', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sit', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__id__sut', '' );
    SELECT has_trigger( 'dst_tbl', '__dst_tbl__id__dt', '' );

    INSERT INTO dst_tbl (src_col) VALUES ('a');
    SELECT * FROM dst_tbl;
    SELECT * FROM src_tbl;
    SELECT results_eq(
        $$ SELECT id, src_col FROM src_tbl $$,
        $$ VALUES ( 1, 'a'::varchar ) $$,
        'src is updated on insert into dst'
    );
    SELECT results_eq(
        $$ SELECT id, src_col FROM dst_tbl $$,
        $$ VALUES ( 1, 'a'::varchar ) $$, '11'
    );

    INSERT INTO src_tbl (src_col) VALUES ('b');
    SELECT results_eq(
        $$ SELECT id, src_col FROM dst_tbl $$,
        $$ VALUES ( 1, 'a'::varchar ) $$,
        'dst is not updated when insert into src'
    );

    UPDATE dst_tbl SET src_col = 'aa' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT id, src_col FROM src_tbl ORDER BY id $$,
        $$ VALUES ( 1, 'aa'::varchar ), ( 2, 'b'::varchar ) $$,
        'src is updated when dst is updated'
    );

    UPDATE src_tbl SET src_col = 'aaaa' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT id, src_col FROM dst_tbl $$,
        $$ VALUES ( 1, 'aaaa'::varchar ) $$, '22'
    );

    DELETE FROM dst_tbl WHERE id = 1;
    SELECT results_eq(
        $$ SELECT id, src_col FROM src_tbl ORDER BY id $$,
        $$ VALUES ( 2, 'b'::varchar ) $$,
        'src deleted when dst deleted'
    );
    SELECT is_empty($$ SELECT * FROM dst_tbl $$);

    INSERT INTO dst_tbl (src_col) VALUES ('c');
    SELECT results_eq(
        $$ SELECT id, src_col FROM src_tbl ORDER BY id $$,
        $$ VALUES ( 2, 'b'::varchar ), ( 3, 'c'::varchar ) $$,
        'insert 2'
    );
    SELECT results_eq(
        $$ SELECT id, src_col FROM dst_tbl $$,
        $$ VALUES ( 3, 'c'::varchar ) $$, '55'
    );

    DELETE FROM src_tbl WHERE id = 3;
    SELECT results_eq(
        $$ SELECT id, src_col FROM src_tbl ORDER BY id $$,
        $$ VALUES ( 2, 'b'::varchar ) $$, '66'
    );
    SELECT is_empty($$ SELECT * FROM dst_tbl $$);

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
