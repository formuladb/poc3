--####################################################################################
DO $migration$
BEGIN

    CREATE OR REPLACE FUNCTION frmdb_0_set_common_cols_trg()
    RETURNS TRIGGER AS $fun$ BEGIN
        IF TG_OP = 'UPDATE' THEN
            NEW.updated_at = now(); 
            NEW.updated_by = current_setting('request.jwt.claim.username', true); 
            RETURN NEW;
        ELSIF TG_OP = 'INSERT' THEN
            RETURN NEW;
        ELSE
            RETURN OLD;
        END IF;
    END;
    $fun$ language 'plpgsql';
END;
$migration$;


--####################################################################################
--
--####################################################################################
CREATE OR REPLACE FUNCTION frmdb_install_common_columns_trg (
    p_table_name regclass
) RETURNS boolean AS $fun$ 
DECLARE
    v_stm varchar;
    v_ret boolean := false;
BEGIN
    IF NOT EXISTS(SELECT * FROM information_schema.triggers
        WHERE event_object_table = p_table_name::name AND trigger_name = p_table_name || '_0')
    THEN
        v_stm := format($$ 
            CREATE TRIGGER %I_0 BEFORE UPDATE ON %I 
                FOR EACH ROW EXECUTE PROCEDURE frmdb_0_set_common_cols_trg()
        $$, p_table_name, p_table_name);
        EXECUTE v_stm;
        RAISE NOTICE 'frmdb_put_table: trigger %_0 created', p_table_name;
        v_ret := true;
    ELSE
        RAISE NOTICE 'frmdb_put_table: trigger %_0 already exists', p_table_name;
    END IF;

    RETURN v_ret;
END; $fun$ language 'plpgsql';
