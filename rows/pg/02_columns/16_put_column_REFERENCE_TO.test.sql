BEGIN;
    SELECT plan( 6 );

    SELECT set_config('request.jwt.claim.tenant', 'pagerows', true);

    CREATE TABLE IF NOT EXISTS src_tbl (
        tenant text NOT NULL DEFAULT current_setting('request.jwt.claim.tenant', true),
        id varchar NOT NULL,
        PRIMARY KEY(tenant, id)
    );

    SELECT has_table( 'public'::name, 'src_tbl'::name );

    CREATE TABLE IF NOT EXISTS dst_tbl (
        tenant text NOT NULL DEFAULT current_setting('request.jwt.claim.tenant', true),
        id varchar NOT NULL,
        PRIMARY KEY(tenant, id)
    );
    SELECT has_table( 'public'::name, 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('src_tbl', 'ref', 'dst_tbl', null, null);
    SELECT has_column( 'src_tbl', 'ref' );

    SELECT has_fk( 'src_tbl', 'test_ref_fk' );
    SELECT col_is_fk( 'src_tbl', ARRAY['tenant', 'ref'] );
    SELECT fk_ok( 'public', 'src_tbl', ARRAY['tenant', 'ref'], 'public', 'dst_tbl', ARRAY['tenant', 'id'] );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
