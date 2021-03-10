BEGIN;
    SELECT plan( 4 );

    CREATE TABLE src_tbl (id serial NOT NULL PRIMARY KEY, src_col varchar);
    SELECT has_table( 'public'::name, 'src_tbl'::name );

    CREATE TABLE dst_tbl (id serial NOT NULL PRIMARY KEY);
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
            ( 'dst_tbl'::regclass, 'id'::varchar, null::varchar ), 
            ( 'dst_tbl'::regclass, 'dst_ref'::varchar, 'src_tbl'::varchar ) 
        $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
