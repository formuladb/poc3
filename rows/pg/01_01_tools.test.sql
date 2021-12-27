BEGIN;
	SELECT plan( 2 );

    SELECT results_eq(
        $$ SELECT frmdb_parse_table_name('schema.test') $$,
        $$ VALUES ( '(schema,test)'::frmdb_table_name_t ) $$
    );
    SELECT results_eq(
        $$ SELECT frmdb_parse_table_name('test') $$,
        $$ SELECT ('(' || current_schema() || ',test)')::frmdb_table_name_t $$
    );	
	SELECT * FROM finish();
	SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
