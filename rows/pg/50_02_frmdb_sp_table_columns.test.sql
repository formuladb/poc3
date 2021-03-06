BEGIN;
    SELECT plan( 4 );

    SELECT frmdb_put_table('src_tbl', 'serial NOT NULL');
    ALTER TABLE src_tbl ADD COLUMN some_col varchar;
    SELECT has_table( 'src_tbl'::name );

    SELECT frmdb_put_table('dst_tbl', 'serial NOT NULL');
    SELECT has_table( 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('dst_tbl', 'dst_ref', 'src_tbl', null, null);
    SELECT has_column( 'dst_tbl', 'dst_ref' );

    select * from information_schema.columns where table_name = 'dst_tbl' AND table_schema = current_schema();
    SELECT * FROM frmdb_sp_table_columns('dst_tbl');
    SELECT c_table_name, c_column_name, c_reference_to FROM frmdb_sp_table_columns('dst_tbl');

    SELECT results_eq(
        $$ SELECT c_table_name, c_column_name, c_reference_to FROM frmdb_sp_table_columns('dst_tbl') $$,
        $$ VALUES 
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
