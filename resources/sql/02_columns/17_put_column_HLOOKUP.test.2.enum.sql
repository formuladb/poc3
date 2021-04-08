BEGIN;
    SELECT plan( 2 );

    CREATE TYPE tenum AS ENUM ('E1', 'E2');

    CREATE TABLE src_tbl (id serial NOT NULL PRIMARY KEY, src_col tenum);
    CREATE TABLE dst_tbl (id serial NOT NULL PRIMARY KEY);
    SELECT frmdb_put_column_REFERENCE_TO('dst_tbl', 'dst_ref', 'src_tbl', null, null);
    SELECT fk_ok( 'public', 'dst_tbl', 'dst_ref', 'public', 'src_tbl', 'id' );

    INSERT INTO src_tbl VALUES (1, 'E1');

    SELECT *
        FROM information_schema.columns
            WHERE table_name = 'src_tbl' AND column_name = 'src_col'	
    ;

    SELECT frmdb_put_column_HLOOKUP('dst_tbl', 'dst_col', 'dst_ref', 'src_col');

    INSERT INTO dst_tbl (id, dst_ref) VALUES (1, 1);
    SELECT * FROM dst_tbl;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl $$,
        $$ VALUES ( 1, 1, 'E1'::tenum ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
