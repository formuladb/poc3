BEGIN;
    SELECT plan( 9 );

    CREATE TABLE test (id varchar NOT NULL PRIMARY KEY);
    SELECT has_table( 'test'::name );

    SELECT frmdb_set_column('test', 'col', 'integer');
    SELECT has_column( 'test', 'col' );

    SELECT results_eq(
        $$ SELECT frmdb_set_check('test', 'col', 'is_not_null(col)') $$,
        $$ VALUES (true) $$
    );
    SELECT col_has_check( current_schema(), 'test', 'col', '' );
    select check_clause from information_schema.check_constraints where constraint_name = 'test__col__ck';
    SELECT results_eq(
        $$ SELECT check_clause::varchar collate "C" FROM information_schema.check_constraints
            WHERE constraint_schema = current_schema() AND constraint_name = 'test__col__ck' $$,
        $$ SELECT '(is_not_null(col))'::varchar collate "C" $$
    );
    SELECT results_eq(
        $$ SELECT frmdb_set_check('test', 'col', 'IS_NOT_NULL(col)') $$,
        $$ VALUES (false) $$
    );

    SELECT results_eq(
        $$ SELECT frmdb_set_check('test', 'col', '_AND(IS_NOT_NULL(col), GT(col, 0))') $$,
        $$ VALUES (true) $$
    );
    SELECT results_eq(
        $$ SELECT check_clause::varchar collate "C" FROM information_schema.check_constraints
            WHERE constraint_schema = current_schema() AND constraint_name = 'test__col__ck' $$,
        $$ SELECT '(_and(is_not_null(col), gt(col, 0)))'::varchar collate "C" $$
    );
    SELECT results_eq(
        $$ SELECT frmdb_set_check('test', 'col', '_and(is_not_null(col), gt(col, 0))') $$,
        $$ VALUES (false) $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
