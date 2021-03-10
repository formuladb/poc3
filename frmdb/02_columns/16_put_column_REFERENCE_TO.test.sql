BEGIN;
    SELECT plan( 6 );

    CREATE TABLE src_tbl (id varchar NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'src_tbl'::name );

    CREATE TABLE dst_tbl (id serial NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('src_tbl', 'ref', 'dst_tbl', null, null);
    SELECT has_column( 'src_tbl', 'ref' );

    SELECT has_fk( 'src_tbl', 'test_ref_fk' );
    SELECT col_is_fk( 'src_tbl', 'ref' );
    SELECT fk_ok( 'public', 'src_tbl', 'ref', 'public', 'dst_tbl', 'id' );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
