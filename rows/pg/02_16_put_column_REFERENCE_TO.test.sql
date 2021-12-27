BEGIN;
    SELECT plan( 6 );

    CREATE TABLE IF NOT EXISTS src_tbl (
        id varchar NOT NULL,
        PRIMARY KEY(id)
    );

    SELECT has_table( 'src_tbl'::name );

    CREATE TABLE IF NOT EXISTS dst_tbl (
        id varchar NOT NULL,
        PRIMARY KEY(id)
    );
    SELECT has_table( 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('src_tbl', 'ref', 'dst_tbl', null, null);
    SELECT has_column( 'src_tbl', 'ref' );

    SELECT * FROM information_schema.table_constraints WHERE table_name = 'src_tbl';
    SELECT * FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE constraint_name = 'src_tbl__ref__fk';

    SELECT has_fk( 'src_tbl', 'test_ref_fk' );
    SELECT col_is_fk( 'src_tbl', ARRAY['ref'] );
    SELECT fk_ok( current_schema(), 'src_tbl', ARRAY['ref'], current_schema(), 'dst_tbl', ARRAY['id'] );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
