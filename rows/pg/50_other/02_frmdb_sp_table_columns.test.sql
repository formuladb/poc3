BEGIN;
    SELECT plan( 4 );

    SELECT set_config('request.jwt.claim.tenant', 'pagerows', true);

    SELECT frmdb_put_table('src_tbl');
    ALTER TABLE src_tbl ADD COLUMN some_col varchar;
    SELECT has_table( 'public'::name, 'src_tbl'::name );

    SELECT frmdb_put_table('dst_tbl');
    SELECT has_table( 'public'::name, 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('dst_tbl', 'dst_ref', 'src_tbl', null, null);
    SELECT has_column( 'dst_tbl', 'dst_ref' );

    -- CREATE DOMAIN frmdb_ref_to_text AS text CHECK (TRUE);
    -- ALTER TABLE dst_tbl ADD COLUMN tst_ref_to frmdb_ref_to_text;

    select * from information_schema.columns where table_name = 'dst_tbl';
    SELECT * FROM frmdb_sp_table_columns('dst_tbl');
    SELECT c_table_name, c_column_name, c_reference_to FROM frmdb_sp_table_columns('dst_tbl');

    SELECT results_eq(
        $$ SELECT c_table_name, c_column_name, c_reference_to FROM frmdb_sp_table_columns('dst_tbl') $$,
        $$ VALUES 
            ( 'dst_tbl'::regclass, 'meta_tenant'::varchar, 'src_tbl'::varchar ), 
            ( 'dst_tbl'::regclass, 'id'::varchar, null::varchar ), 
            ( 'dst_tbl'::regclass, 'meta_created_at'::varchar, null::varchar ), 
            ( 'dst_tbl'::regclass, 'meta_created_by'::varchar, null::varchar ),
            ( 'dst_tbl'::regclass, 'meta_updated_at'::varchar, null::varchar ),
            ( 'dst_tbl'::regclass, 'meta_updated_by'::varchar, null::varchar ),
            ( 'dst_tbl'::regclass, 'dst_ref'::varchar, 'src_tbl'::varchar ) 
        $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
