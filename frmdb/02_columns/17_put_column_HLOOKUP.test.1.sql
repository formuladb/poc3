BEGIN;
    SELECT plan( 35 );

    CREATE TABLE src_tbl (id serial NOT NULL PRIMARY KEY, src_col varchar);
    SELECT has_table( 'public'::name, 'src_tbl'::name );

    CREATE TABLE dst_tbl (id serial NOT NULL PRIMARY KEY);
    SELECT has_table( 'public'::name, 'dst_tbl'::name );

    SELECT frmdb_put_column_REFERENCE_TO('dst_tbl', 'dst_ref', 'src_tbl', null, null);
    SELECT has_column( 'dst_tbl', 'dst_ref' );
    SELECT has_fk( 'dst_tbl', 'dst_tbl__dst_ref__fk' );
    SELECT fk_ok( 'public', 'dst_tbl', 'dst_ref', 'public', 'src_tbl', 'id' );

    SELECT frmdb_put_column_HLOOKUP('dst_tbl', 'dst_col', 'dst_ref', 'src_col');

    SELECT trigger_name, action_statement FROM information_schema.triggers 
        WHERE event_object_table = 'src_tbl';
    SELECT has_trigger( 'src_tbl', '__dst_tbl__dst_col__sdt', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__dst_col__sit', '' );
    SELECT has_trigger( 'src_tbl', '__dst_tbl__dst_col__sut', '' );

    SELECT trigger_name, action_statement FROM information_schema.triggers 
        WHERE event_object_table = 'dst_tbl';

    SELECT has_trigger( 'dst_tbl', '10__dst_tbl__dst_col__dt', '' );

    INSERT INTO src_tbl VALUES (1, 'a');
    INSERT INTO src_tbl VALUES (2, 'b');

    CREATE VIEW srv_v AS SELECT * FROM src_tbl;

    INSERT INTO dst_tbl (id, dst_ref) VALUES (1, 1);

    \echo =========================================================================
    \echo == HLOOKUP tests      ==
    \echo =========================================================================

    SELECT * FROM dst_tbl;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl $$,
        $$ VALUES ( 1, 1, 'a'::varchar ) $$
    );

    UPDATE dst_tbl SET dst_ref = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl $$,
        $$ VALUES ( 1, 2, 'b'::varchar ) $$
    );

    UPDATE src_tbl SET src_col = 'bb' WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl $$,
        $$ VALUES ( 1, 2, 'bb'::varchar ) $$
    );

    \echo =========================================================================
    \echo == renaming table src_tbl which has views and triggers associated      ==
    \echo =========================================================================
    SELECT tgname, oid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid;    
    SELECT frmdb_rename_table('src_tbl', 'src_tbl2');
    SELECT has_table('src_tbl2');
    SELECT hasnt_table('src_tbl');

    SELECT trigger_name, action_statement FROM information_schema.triggers 
        WHERE event_object_table = 'src_tbl';
    SELECT has_trigger( 'src_tbl2', '__dst_tbl__dst_col__sdt', '' );
    SELECT has_trigger( 'src_tbl2', '__dst_tbl__dst_col__sit', '' );
    SELECT has_trigger( 'src_tbl2', '__dst_tbl__dst_col__sut', '' );
    

    SELECT trigger_name, action_statement FROM information_schema.triggers 
        WHERE event_object_table = 'dst_tbl';
    SELECT has_trigger( 'dst_tbl', '10__dst_tbl__dst_col__dt', '' );

    UPDATE src_tbl2 SET src_col = 'bbb' WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl $$,
        $$ VALUES ( 1, 2, 'bbb'::varchar ) $$
    );

    \echo =========================================================================
    \echo == renaming table dst_tbl                                              ==
    \echo =========================================================================
    SELECT tgname, oid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid;    
    SELECT frmdb_rename_table('dst_tbl', 'dst_tbl2');
    SELECT has_table('dst_tbl2');
    SELECT hasnt_table('dst_tbl');

    UPDATE src_tbl2 SET src_col = 'bbb2' WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ) $$
    );

    INSERT INTO dst_tbl2 (id, dst_ref) VALUES (2, 1);
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 1, 'a'::varchar ) $$
    );

    \echo =========================================================================
    \echo == renaming column src_tbl.src_col                                     ==
    \echo =========================================================================
    SELECT tgname, oid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid;    
    SELECT frmdb_rename_table_column('src_tbl2', 'src_col', 'src_col2');
    SELECT hasnt_column( 'src_tbl2', 'src_col' );
    SELECT has_column( 'src_tbl2', 'src_col2' );

    UPDATE src_tbl2 SET src_col2 = 'a2' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 1, 'a2'::varchar ) $$
    );


    \echo =========================================================================
    \echo == renaming column dst_tbl.dst_col                                     ==
    \echo =========================================================================
    SELECT tgname, oid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid;    
    SELECT frmdb_rename_table_column('dst_tbl2', 'dst_col', 'dst_col2');
    SELECT hasnt_column( 'dst_tbl2', 'dst_col' );
    SELECT has_column( 'dst_tbl2', 'dst_col2' );

    UPDATE src_tbl2 SET src_col2 = 'a22' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 1, 'a22'::varchar ) $$
    );

    \echo =========================================================================
    \echo == renaming column dst_tbl.dst_ref                                     ==
    \echo =========================================================================
    SELECT tgname, oid, description as trg_statement
        FROM pg_trigger
            INNER JOIN pg_description ON pg_description.objoid = pg_trigger.oid;    
    SELECT frmdb_rename_table_column('dst_tbl2', 'dst_ref', 'dst_ref2');
    SELECT hasnt_column( 'dst_tbl2', 'dst_ref' );
    SELECT has_column( 'dst_tbl2', 'dst_ref2' );

    UPDATE src_tbl2 SET src_col2 = 'a222' WHERE id = 1;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 1, 'a222'::varchar ) $$
    );

    UPDATE dst_tbl2 SET dst_ref2 = 2 WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 2, 'bbb2'::varchar ) $$
    );

    INSERT INTO dst_tbl2 (id, dst_ref2) VALUES (3, 1);
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 $$,
        $$ VALUES ( 1, 2, 'bbb2'::varchar ), ( 2, 2, 'bbb2'::varchar ), ( 3, 1, 'a222'::varchar ) $$
    );

    \echo == one source updating multiple destinations ==
    select * from src_tbl2;
    select * from dst_tbl2;
    UPDATE src_tbl2 SET src_col2 = 'B2' WHERE id = 2;
    SELECT results_eq(
        $$ SELECT * FROM dst_tbl2 ORDER BY id $$,
        $$ VALUES ( 1, 2, 'B2'::varchar ), ( 2, 2, 'B2'::varchar ), ( 3, 1, 'a222'::varchar ) $$
    );


    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
