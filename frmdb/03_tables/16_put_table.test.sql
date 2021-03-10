BEGIN;
    SELECT plan( 3 );

    SELECT frmdb_put_table('tbl');
    SELECT has_table( 'tbl'::name );
    SELECT has_column( 'tbl'::name, 'id', '' );
    SELECT has_column( 'tbl'::name, 'created_at', '' );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
