BEGIN;
    SELECT plan( 9 );

    CREATE TABLE src_tbl (id serial PRIMARY KEY, src_col varchar, src_col2 integer);
    SELECT has_table( 'src_tbl'::name );
    SELECT has_column( 'src_tbl'::name, 'src_col'::name );

    SELECT frmdb_put_table_GENERATED('dst_tbl', 'src_tbl', 'src_col', '{}'::varchar[]);
    SELECT has_table( 'dst_tbl'::name );
    SELECT col_type_is( current_schema(), 'dst_tbl', 'id', 'pg_catalog', 'character varying', 'check-id-type' );
    SELECT has_column( 'dst_tbl'::name, 'meta_created_at', '' );

    INSERT INTO src_tbl (id, src_col) VALUES (1, 'a');
    SELECT results_eq(
        $$ SELECT id FROM dst_tbl $$,
        $$ VALUES ( 'a'::varchar ) $$
    );

    SELECT frmdb_put_table_GENERATED('dst_tbl2', 'src_tbl', 'src_col', '{"src_col2"}'::varchar[]);
    INSERT INTO src_tbl (id, src_col, src_col2) VALUES (2, 'b', 123);
    SELECT results_eq(
        $$ SELECT id FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar ), ( 'b'::varchar ) $$
    );
    SELECT results_eq(
        $$ SELECT id, src_col2 FROM dst_tbl2 ORDER BY id $$,
        $$ VALUES ( 'b'::varchar, 123 ) $$
    );

    UPDATE src_tbl SET src_col2 = 456 WHERE id = 2;
    SELECT results_eq(
        $$ SELECT id, src_col2 FROM dst_tbl2 ORDER BY id $$,
        $$ VALUES ( 'b'::varchar, 456 ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
