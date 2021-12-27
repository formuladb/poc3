BEGIN;
    SELECT plan( 11 );

    CREATE TABLE src_tbl (id integer PRIMARY KEY, src_ref varchar, src_col integer, src_filter boolean);
    CREATE TABLE dst_tbl (id varchar PRIMARY KEY);
    SELECT has_table( 'src_tbl'::name );
    SELECT has_table( 'dst_tbl'::name );

    SELECT frmdb_put_column_ROLLUP('dst_tbl', 'dst_col', 'src_tbl', 'src_col', 
        'SUM', 'src_ref', 'IS_TRUE(src_filter)');
    SELECT col_type_is( current_schema(), 'dst_tbl', 'dst_col', 'pg_catalog', 'integer', 'check-type' );
    SELECT col_default_is( current_schema(), 'dst_tbl', 'dst_col', 0, '' );

    INSERT INTO src_tbl VALUES (1, 'a', 10, true);
    INSERT INTO dst_tbl VALUES ('a', default);
    INSERT INTO dst_tbl VALUES ('b', default);
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 10 ), ( 'b'::varchar, 0 ) $$
    );

    UPDATE src_tbl VALUES SET src_col = 11 WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 11 ), ( 'b'::varchar, 0 ) $$
    );

    INSERT INTO src_tbl VALUES (2, 'a', 10, true);
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 21 ), ( 'b'::varchar, 0 ) $$
    );

    UPDATE src_tbl VALUES SET src_col = 9 WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 19 ), ( 'b'::varchar, 0 ) $$
    );

    DELETE FROM src_tbl VALUES WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 9 ), ( 'b'::varchar, 0 ) $$
    );

    UPDATE src_tbl VALUES SET src_ref = 'b' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 0 ), ( 'b'::varchar, 9 ) $$
    );

    UPDATE src_tbl VALUES SET src_filter = false WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 'a'::varchar, 0 ), ( 'b'::varchar, 0 ) $$
    );

    --TODO: add test with ROLLUP with HLOOKUP fkey
    --TODO: add test with ROLLUP with HLOOKUP value

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
