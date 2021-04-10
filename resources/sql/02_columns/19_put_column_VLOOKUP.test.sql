BEGIN;
    SELECT plan( 7 );

    CREATE TABLE src_tbl (id integer PRIMARY KEY, src_join varchar, src_nb integer);
    CREATE TABLE dst_tbl (id integer PRIMARY KEY, dst_join varchar, dst_nb integer);
    SELECT has_table( 'public'::name, 'src_tbl'::name );
    SELECT has_table( 'public'::name, 'dst_tbl'::name );

    SELECT frmdb_put_column_VLOOKUP(
        p_table_name := 'dst_tbl', 
        p_col_name := 'src_id',
        p_src_table := 'src_tbl',
        p_src_vlookup_col_name := 'id',
        p_dst_join_col_name := 'dst_join',
        p_src_join_col_name := 'src_join',
        p_filter_expr := $$  src.src_nb < dst.dst_nb $$
    );

    SELECT col_type_is( 'public', 'dst_tbl', 'src_id', 'pg_catalog', 'integer', 'check-type' );
    SELECT col_type_is( 'public', 'dst_tbl', 'dst_nb', 'pg_catalog', 'integer', 'check-type' );

    INSERT INTO src_tbl (id, src_join, src_nb) VALUES (123, 'a', 10);
    INSERT INTO src_tbl (id, src_join, src_nb) VALUES (124, 'a', 100);
    INSERT INTO dst_tbl (id, dst_join, dst_nb) VALUES (456, 'a', 20);
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 456, 'a'::varchar, 20, 123 ) $$
    );

    UPDATE src_tbl VALUES SET src_nb = 21 WHERE id = 123;
    SELECT id, dst_join, dst_nb, src_id FROM dst_tbl ORDER BY id;
    SELECT results_eq(
        $$ SELECT id, dst_join, dst_nb, COALESCE(src_id, 1234567) FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 456, 'a'::varchar, 20, 1234567 ) $$
    );

    UPDATE src_tbl VALUES SET src_nb = 5 WHERE id = 123;
    SELECT results_eq(
        $$ SELECT id, dst_join, dst_nb, src_id FROM dst_tbl ORDER BY id $$,
        $$ VALUES ( 456, 'a'::varchar, 20, 123 ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
