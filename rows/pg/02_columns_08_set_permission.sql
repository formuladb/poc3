DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'frmdb_permission_t') THEN
        CREATE DOMAIN frmdb_permission_t AS TEXT CHECK(VALUE ~ '^(true|false|frmdb_is_owner)');
    END IF;
END$$;

--#######################################################################################
--#######################################################################################

CREATE OR REPLACE FUNCTION frmdb_is_owner(
    val1 varchar, 
    val2 varchar DEFAULT NULL, 
    val3 varchar DEFAULT NULL, 
    val4 varchar DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql COST 10000 AS $fun$
DECLARE
    v_ret boolean;
BEGIN
    v_ret := current_setting('request.jwt.claim.username', true) = ANY(ARRAY[val1, val2, val3, val4]);
    RAISE NOTICE 'frmdb_is_owner(%, %) #% % = %', val1, val2, current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true), v_ret;
    -- IF v_ret IS NULL OR v_ret <> TRUE THEN
    --     --https://stackoverflow.com/questions/58521638/postgresql-row-level-security-does-not-throw-errors
    --     RAISE EXCEPTION 'frmdb_is_owner_id denied for #% %', current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true);
    -- END IF;

    RETURN v_ret;
END; $fun$;

--#######################################################################################
--#######################################################################################

CREATE OR REPLACE FUNCTION frmdb_is_owner_id(
    val1 varchar, 
    val2 varchar DEFAULT NULL, 
    val3 varchar DEFAULT NULL, 
    val4 varchar DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql COST 10000 AS $fun$
DECLARE
    v_ret boolean;
BEGIN
    v_ret := current_setting('request.jwt.claim.user_id', true) = ANY(ARRAY[val1, val2, val3, val4]);
    RAISE NOTICE 'frmdb_is_owner_id(%, %) #% % = %', val1, val2, current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true), v_ret;
    -- IF v_ret IS NULL OR v_ret <> TRUE THEN
    --     RAISE EXCEPTION 'frmdb_is_owner_id denied for #% %', current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true);
    -- END IF;

    RETURN v_ret;
END; $fun$;

CREATE OR REPLACE FUNCTION frmdb_is_owner_id(
    val1 integer, 
    val2 integer DEFAULT NULL, 
    val3 integer DEFAULT NULL, 
    val4 integer DEFAULT NULL
) RETURNS boolean LANGUAGE plpgsql COST 10000 AS $fun$
DECLARE
    v_ret boolean;
BEGIN
    v_ret := current_setting('request.jwt.claim.user_id', true)::integer = ANY(ARRAY[val1, val2, val3, val4]);
    RAISE NOTICE 'frmdb_is_owner_id(%, %) #% % = %', val1, val2, current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true), v_ret;
    -- IF v_ret IS NULL OR v_ret <> TRUE THEN
    --     RAISE EXCEPTION 'frmdb_is_owner_id denied for #% %', current_setting('request.jwt.claim.user_id', true), current_setting('request.jwt.claim.username', true);
    -- END IF;

    RETURN v_ret;
END; $fun$;

--#######################################################################################
--#######################################################################################
--#######################################################################################
--#######################################################################################
--#######################################################################################

DO $migration$
BEGIN
    -- BEGIN
    -- 	EXECUTE $$ DROP FUNCTION frmdb_put_table $$;
    -- EXCEPTION WHEN OTHERS THEN raise notice '% %', SQLERRM, SQLSTATE; END;
    
    CREATE OR REPLACE FUNCTION frmdb_set_permission(
        p_role_name regrole,
        p_table_name regclass, 
        p_select_perm frmdb_permission_t,
        p_insert_perm frmdb_permission_t,
        p_update_perm frmdb_permission_t,
        p_delete_perm frmdb_permission_t
    ) RETURNS void AS $fun$ 
    DECLARE
        v_ops varchar[] := ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
        v_op varchar;
        v_policy varchar;
        v_perm varchar;
        v_exiting_perm varchar;
        v_policyname varchar;
        v_idx integer;
        v_stm varchar;
        v_seq_name text;
        v_is_view boolean;
    BEGIN
        v_idx := 1;

        IF p_select_perm <> 'false' THEN
            v_stm := format($$ GRANT SELECT ON %I TO %I $$, p_table_name, p_role_name);
            EXECUTE v_stm;
        END IF;

        IF p_insert_perm <> 'false' THEN
            v_stm := format($$ GRANT INSERT ON %I TO %I $$, p_table_name, p_role_name);
            EXECUTE v_stm;

            v_stm := format($$ GRANT UPDATE ON %I TO %I $$, p_table_name, p_role_name);
            EXECUTE v_stm;

            v_seq_name := p_table_name || '_id_seq';
            IF EXISTS ( SELECT * FROM information_schema.sequences WHERE sequence_name = v_seq_name) THEN
                v_stm := format($$ GRANT USAGE, SELECT, UPDATE ON %I TO %I $$, 
                    v_seq_name, p_role_name);
                EXECUTE v_stm;
            END IF;
        END IF;

        IF p_update_perm <> 'false' THEN
            v_stm := format($$ GRANT UPDATE ON %I TO %I $$, p_table_name, p_role_name);
            EXECUTE v_stm;
        END IF;

        IF p_delete_perm <> 'false' THEN
            v_stm := format($$ GRANT DELETE ON ALL TABLES IN SCHEMA public TO %I $$, p_role_name);
            EXECUTE v_stm;
        END IF;        

        SELECT TRUE INTO v_is_view FROM information_schema.tables t
            WHERE t.table_name = p_table_name::information_schema.sql_identifier
                AND t.table_type = 'VIEW';

        IF v_is_view IS NULL THEN
            FOREACH v_perm IN ARRAY ARRAY[
                p_select_perm, 
                p_insert_perm,
                p_update_perm,
                p_delete_perm
            ] LOOP
                v_op := v_ops[v_idx];
                v_policyname := p_table_name::oid || '_' || v_op || '_' || p_role_name::oid;

                IF v_op = 'INSERT' THEN
                    v_policy := format('WITH CHECK (%s)', v_perm);
                    SELECT with_check INTO v_exiting_perm FROM pg_catalog.pg_policies
                            WHERE  policyname = v_policyname;
                ELSE
                    IF v_op = 'UPDATE' THEN
                        v_policy := format('USING (%s) WITH CHECK (%s)', v_perm, v_perm);
                    ELSE
                        v_policy := format('USING (%s)', v_perm);
                    END IF;

                    SELECT qual INTO v_exiting_perm FROM pg_catalog.pg_policies
                            WHERE  policyname = v_policyname;
                END IF;


                RAISE NOTICE 'frmdb_set_permission v_op=%, v_policy=%, v_policyname=%, v_exiting_perm=%', v_op, v_policy, v_policyname, v_exiting_perm;
                IF v_exiting_perm IS NOT NULL THEN
                    IF v_exiting_perm <> v_perm THEN
                        v_stm := format($$ 
                            ALTER POLICY %I ON %I 
                                TO %I
                                %s;
                        $$, v_policyname, p_table_name,
                            p_role_name,
                            v_policy
                        );
                        RAISE NOTICE 'frmdb_set_permission %', v_stm;
                        EXECUTE v_stm;
                    ELSE
                        RAISE NOTICE 'frmdb_set_permission policy % % already exists', v_policyname, v_exiting_perm;
                    END IF;
                ELSE
                    v_stm := format($$ 
                        CREATE POLICY %I ON %I 
                            FOR %s TO %I
                            %s;
                    $$, v_policyname, p_table_name,
                        v_op, p_role_name,
                        v_policy
                    );
                    RAISE NOTICE 'frmdb_set_permission %', v_stm;
                    EXECUTE v_stm;
                END IF;

                v_idx := v_idx + 1;
            END LOOP;
        END IF;

    END; $fun$ language 'plpgsql';
END;
$migration$;


--#######################################################################################
--#######################################################################################
--#######################################################################################
--#######################################################################################
--#######################################################################################


CREATE OR REPLACE FUNCTION frmdb_set_permission_on_all_tables(
    p_role_name regrole,
    p_select_perm frmdb_permission_t,
    p_insert_perm frmdb_permission_t,
    p_update_perm frmdb_permission_t,
    p_delete_perm frmdb_permission_t
) RETURNS void AS $fun$ 
DECLARE
    v_rec RECORD;
    v_stm varchar;
BEGIN

    FOR v_rec IN SELECT table_name from information_schema.tables where table_schema = current_schema()
    LOOP
        PERFORM frmdb_set_permission(
            p_role_name, 
            v_rec.table_name::regclass, 
            p_select_perm,
            p_insert_perm,
            p_update_perm,
            p_delete_perm
        );
    END LOOP;
END; $fun$ language 'plpgsql';
