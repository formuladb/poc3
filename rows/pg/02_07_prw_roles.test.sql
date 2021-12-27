BEGIN;
    SELECT plan( 1 );

    INSERT INTO prw_roles (id) VALUES ('testadminrole');
    SELECT results_eq(
        $$ SELECT id FROM prw_roles WHERE id = 'testadminrole' $$,
        $$ VALUES ('testadminrole'::text collate "C") $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
