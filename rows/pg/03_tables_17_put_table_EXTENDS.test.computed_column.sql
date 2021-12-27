BEGIN;
    SELECT plan( 11 );

    SELECT set_config('request.jwt.claim.tenant', 'pagerows', true);

    SELECT frmdb_put_table('src_tbl');
    ALTER TABLE src_tbl ADD COLUMN some_col varchar;
    ALTER TABLE src_tbl ADD COLUMN src_col varchar GENERATED ALWAYS AS (some_col || 'x') STORED;

    SELECT has_table( 'src_tbl'::name );
    SELECT has_column( 'src_tbl'::name, 'some_col'::name );
    SELECT has_column( 'src_tbl'::name, 'src_col'::name );

    SELECT frmdb_put_table_extends('dst_tbl', 'src_tbl', '{"some_col", "src_col"}'::varchar[]);
    SELECT has_table( 'dst_tbl'::name );
    SELECT has_column( 'dst_tbl'::name, 'some_col', '' );
    SELECT has_column( 'dst_tbl'::name, 'src_col', '' );
    SELECT has_column( 'dst_tbl'::name, 'meta_created_at', '' );

    INSERT INTO dst_tbl (some_col, src_col) VALUES ('a', null);
    \d dst_tbl
    SELECT id, some_col, src_col FROM dst_tbl;
    SELECT * FROM src_tbl;
    SELECT results_eq(
        $$ SELECT id, some_col, src_col FROM src_tbl $$,
        $$ VALUES ( 1, 'a'::varchar, 'ax'::varchar ) $$
    );
    SELECT results_eq(
        $$ SELECT id, some_col, src_col FROM dst_tbl $$,
        $$ VALUES ( 1, 'a'::varchar, 'ax'::varchar ) $$
    );

    UPDATE dst_tbl SET some_col = 'aa' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT id, some_col, src_col FROM src_tbl $$,
        $$ VALUES ( 1, 'aa'::varchar, 'aax'::varchar ) $$
    );
    SELECT results_eq(
        $$ SELECT id, some_col, src_col FROM dst_tbl $$,
        $$ VALUES ( 1, 'aa'::varchar, 'aax'::varchar ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
