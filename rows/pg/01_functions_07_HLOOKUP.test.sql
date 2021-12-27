BEGIN;
    SELECT plan( 5 );

    CREATE TABLE tgrandparent (id integer NOT NULL PRIMARY KEY, gpval text);
    SELECT * FROM tgrandparent;
    SELECT has_table( 'tgrandparent'::name );
    CREATE TABLE tparent (id integer NOT NULL PRIMARY KEY, pval text, gpfkey integer references tgrandparent(id));
    SELECT has_table( 'tparent'::name );
    CREATE TABLE test (id text NOT NULL PRIMARY KEY, pfkey integer references tparent(id));
    SELECT has_table( 'test'::name );


    INSERT INTO tgrandparent VALUES (1, 'gpval1');
    INSERT INTO tparent VALUES (1, 'pval1', 1);
    INSERT INTO test VALUES ('t1', 1);

    SELECT results_eq(
        $$ SELECT id, pfkey, hlookup('tparent', pfkey, 'pval') as pval FROM test $$,
        $$ VALUES ('t1', 1, 'pval1') $$
    );


    SELECT results_eq(
        $$ SELECT id, pfkey, hlookup2('tparent', pfkey, 'tgrandparent', 'gpfkey', 'gpval') as gpval FROM test $$,
        $$ VALUES ('t1', 1, 'gpval1') $$
    );

    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
