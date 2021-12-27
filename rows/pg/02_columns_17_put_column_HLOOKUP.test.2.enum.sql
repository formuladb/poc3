BEGIN;
    SELECT plan( 2 );

    CREATE TYPE tenum AS ENUM ('E1', 'E2');

    CREATE TABLE IF NOT EXISTS src_tbl (
        id serial NOT NULL,
        src_col tenum,
        PRIMARY KEY(id)
    );
    CREATE TABLE IF NOT EXISTS dst_tbl (
        id serial NOT NULL,
        PRIMARY KEY(id)
    );
    SELECT frmdb_put_column_REFERENCE_TO('dst_tbl', 'dst_ref', 'src_tbl', null, null);
    SELECT fk_ok( current_schema(), 'dst_tbl', ARRAY['dst_ref'], current_schema(), 'src_tbl', ARRAY['id'] );

    INSERT INTO src_tbl (id, src_col) VALUES (1, 'E1');

    SELECT *
        FROM information_schema.columns
            WHERE table_name = 'src_tbl' AND column_name = 'src_col'	
    ;

    SELECT frmdb_put_column_HLOOKUP('dst_tbl', 'dst_col', 'dst_ref', 'src_col');

    INSERT INTO dst_tbl (id, dst_ref) VALUES (1, 1);
    SELECT * FROM dst_tbl;
    SELECT results_eq(
        $$ SELECT id, dst_ref, dst_col FROM dst_tbl $$,
        $$ VALUES ( 1, 1, 'E1'::tenum ) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
