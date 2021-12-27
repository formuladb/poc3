SELECT frmdb_put_table('prw_tables', 'text');
SELECT frmdb_put_column('prw_tables', 'id_type', 'text');
SELECT frmdb_put_column('prw_tables', 'parent', 'text');
SELECT frmdb_put_column('prw_tables', 'resource_type', 'text', '_and(is_not_null(resource_type), is_enum(resource_type, ''GROUP'', ''PAGE'', ''RESOURCE''))', '''RESOURCE''');
SELECT frmdb_put_column('prw_tables', 'icon', 'text', 'is_not_null(icon)', $$'material-design-icons-table_rows'$$);
SELECT frmdb_put_column('prw_tables', 'menu_order', 'integer', null, '0');
SELECT frmdb_put_column('prw_tables', 'options', 'json');

CALL frmdb_internal_migrate_function('prw_tables_cud', $MIGR$
    CREATE OR REPLACE FUNCTION prw_tables_cud() RETURNS trigger AS
    $func$
    DECLARE
        v_stm varchar;
    BEGIN
        IF (TG_OP = 'DELETE' ) THEN
            IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.views WHERE table_name = OLD.id) THEN RETURN NULL; END IF;
            IF OLD.id = 'prw_tables' THEN RETURN NULL; END IF;
            IF OLD.resource_type = 'RESOURCE' THEN
            --TODO: check that the table is not used in any REFERENCE_TO
            --TODO: check that the table is not used in any prw_pages
                v_stm := format($$ DROP TABLE %I $$, OLD.id);
                EXECUTE v_stm;
                RAISE NOTICE 'prw_tables_cud: %', v_stm;            
                RETURN NULL;
            END IF;
        ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE')  THEN
            IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.views WHERE table_name = NEW.id) THEN RETURN NEW; END IF;
            IF NEW.id = 'prw_tables' THEN RETURN NEW; END IF;
            IF NEW.resource_type = 'RESOURCE' THEN
                --TODO frmdb_put_table_MANY2MANY
                --TODO frmdb_put_table_GENERATED
                PERFORM frmdb_put_table(
                    NEW.id, 
                    NEW.id_type
                );
            END IF;
            RETURN NEW;
        END IF;
    END;
    $func$ LANGUAGE plpgsql;
$MIGR$);

SELECT frmdb_set_trigger('prw_tables_cud_trg', 'prw_tables', $MIGR$
    CREATE TRIGGER prw_tables_cud_trg
    AFTER INSERT OR UPDATE OR DELETE ON prw_tables
    FOR EACH ROW
    EXECUTE PROCEDURE prw_tables_cud();
$MIGR$);
