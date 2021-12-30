SHELL := /bin/bash
all: $(shell ls *sql|sed -e 's!^!/tenants/logs/$(SCHEMA)/!; s!.sql$$!.log!')

clean:
	@if [ -z "$(SCHEMA)" ]; then echo "SCHEMA not defined"; exit 1; fi
	rm -rf $(SCHEMA).log /tenants/logs/$(SCHEMA)

$(SCHEMA).log:
	@if [ -z "$(SCHEMA)" ]; then echo "SCHEMA not defined"; exit 1; fi
	@mkdir -p /tenants/logs/$(SCHEMA)
	@psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "CREATE SCHEMA IF NOT EXISTS exts; CREATE SCHEMA IF NOT EXISTS $(SCHEMA); GRANT ALL ON SCHEMA $(SCHEMA) TO postgres;" > $(SCHEMA).log 2>&1

/tenants/logs/$(SCHEMA)/%.log: %.sql $(SCHEMA).log
	@(psql -P pager=off -v ON_ERROR_STOP=1 -e -h db -U postgres -d "postgres" \
		-c "SET search_path TO $(SCHEMA),exts;" \
		-f $< >$@ 2>&1) || (cat $@; rm $@; exit 1)


/tenants/logs/$(SCHEMA)/01_00__set_type.log: 01_00__set_type.sql
/tenants/logs/$(SCHEMA)/01_00__trigger_call_stack.log: 01_00__trigger_call_stack.sql /tenants/logs/$(SCHEMA)/01_00__set_type.log
/tenants/logs/$(SCHEMA)/01_00_frmdb_internal_migrate_function.log: 01_00_frmdb_internal_migrate_function.sql /tenants/logs/$(SCHEMA)/01_00__trigger_call_stack.log
/tenants/logs/$(SCHEMA)/01_00_setup.log: 01_00_setup.sql /tenants/logs/$(SCHEMA)/01_00_frmdb_internal_migrate_function.log
/tenants/logs/$(SCHEMA)/01_01__set_trigger.log: 01_01__set_trigger.sql /tenants/logs/$(SCHEMA)/01_00_setup.log
/tenants/logs/$(SCHEMA)/01_01_set_formula_row_trigger.log: 01_01_set_formula_row_trigger.sql /tenants/logs/$(SCHEMA)/01_01__set_trigger.log
/tenants/logs/$(SCHEMA)/01_01_set_formula_statement_trigger.log: 01_01_set_formula_statement_trigger.sql /tenants/logs/$(SCHEMA)/01_01_set_formula_row_trigger.log
/tenants/logs/$(SCHEMA)/01_01_tools.log: 01_01_tools.sql /tenants/logs/$(SCHEMA)/01_01_set_formula_statement_trigger.log
/tenants/logs/$(SCHEMA)/01_01_tools.test.log: 01_01_tools.test.sql /tenants/logs/$(SCHEMA)/01_01_tools.log
/tenants/logs/$(SCHEMA)/01_02_delete_table.log: 01_02_delete_table.sql /tenants/logs/$(SCHEMA)/01_01_tools.test.log
/tenants/logs/$(SCHEMA)/01_02_rename_table.log: 01_02_rename_table.sql /tenants/logs/$(SCHEMA)/01_02_delete_table.log
/tenants/logs/$(SCHEMA)/01_03_delete_table_column.log: 01_03_delete_table_column.sql /tenants/logs/$(SCHEMA)/01_02_rename_table.log
/tenants/logs/$(SCHEMA)/01_03_rename_table_column.log: 01_03_rename_table_column.sql /tenants/logs/$(SCHEMA)/01_03_delete_table_column.log
/tenants/logs/$(SCHEMA)/01_05_AND-NOT-NULL-EQ-GT.log: 01_05_AND-NOT-NULL-EQ-GT.sql /tenants/logs/$(SCHEMA)/01_03_rename_table_column.log
/tenants/logs/$(SCHEMA)/01_05_DATE_functions.log: 01_05_DATE_functions.sql /tenants/logs/$(SCHEMA)/01_05_AND-NOT-NULL-EQ-GT.log
/tenants/logs/$(SCHEMA)/01_06_DATEDIFF.log: 01_06_DATEDIFF.sql /tenants/logs/$(SCHEMA)/01_05_DATE_functions.log
/tenants/logs/$(SCHEMA)/01_07_HLOOKUP.log: 01_07_HLOOKUP.sql /tenants/logs/$(SCHEMA)/01_06_DATEDIFF.log
/tenants/logs/$(SCHEMA)/01_07_HLOOKUP.test.log: 01_07_HLOOKUP.test.sql /tenants/logs/$(SCHEMA)/01_07_HLOOKUP.log
/tenants/logs/$(SCHEMA)/01_08_intrenal_functions.log: 01_08_intrenal_functions.sql /tenants/logs/$(SCHEMA)/01_07_HLOOKUP.test.log
/tenants/logs/$(SCHEMA)/02_01_common_columns.log: 02_01_common_columns.sql /tenants/logs/$(SCHEMA)/01_08_intrenal_functions.log
/tenants/logs/$(SCHEMA)/02_07_create_role.log: 02_07_create_role.sql /tenants/logs/$(SCHEMA)/02_01_common_columns.log
/tenants/logs/$(SCHEMA)/02_07_prw_roles.log: 02_07_prw_roles.sql /tenants/logs/$(SCHEMA)/02_07_create_role.log
/tenants/logs/$(SCHEMA)/02_07_prw_roles.test.log: 02_07_prw_roles.test.sql /tenants/logs/$(SCHEMA)/02_07_prw_roles.log
/tenants/logs/$(SCHEMA)/02_08_set_permission.log: 02_08_set_permission.sql /tenants/logs/$(SCHEMA)/02_07_prw_roles.test.log
/tenants/logs/$(SCHEMA)/02_08_set_permission.test.parent_table.log: 02_08_set_permission.test.parent_table.sql /tenants/logs/$(SCHEMA)/02_08_set_permission.log
/tenants/logs/$(SCHEMA)/02_08_set_permission.test.log: 02_08_set_permission.test.sql /tenants/logs/$(SCHEMA)/02_08_set_permission.test.parent_table.log
/tenants/logs/$(SCHEMA)/02_08_set_permission.test.view.log: 02_08_set_permission.test.view.sql /tenants/logs/$(SCHEMA)/02_08_set_permission.test.log
/tenants/logs/$(SCHEMA)/02_08_v_prw_permissions.log: 02_08_v_prw_permissions.sql /tenants/logs/$(SCHEMA)/02_08_set_permission.test.view.log
/tenants/logs/$(SCHEMA)/02_08_v_prw_permissions.test.log: 02_08_v_prw_permissions.test.sql /tenants/logs/$(SCHEMA)/02_08_v_prw_permissions.log
/tenants/logs/$(SCHEMA)/02_10_set_column.log: 02_10_set_column.sql /tenants/logs/$(SCHEMA)/02_08_v_prw_permissions.test.log
/tenants/logs/$(SCHEMA)/02_10_set_column.test.log: 02_10_set_column.test.sql /tenants/logs/$(SCHEMA)/02_10_set_column.log
/tenants/logs/$(SCHEMA)/02_12_set_check.log: 02_12_set_check.sql /tenants/logs/$(SCHEMA)/02_10_set_column.test.log
/tenants/logs/$(SCHEMA)/02_12_set_check.test.log: 02_12_set_check.test.sql /tenants/logs/$(SCHEMA)/02_12_set_check.log
/tenants/logs/$(SCHEMA)/02_13_set_default.log: 02_13_set_default.sql /tenants/logs/$(SCHEMA)/02_12_set_check.test.log
/tenants/logs/$(SCHEMA)/02_13_set_default.test.log: 02_13_set_default.test.sql /tenants/logs/$(SCHEMA)/02_13_set_default.log
/tenants/logs/$(SCHEMA)/02_15_put_column.log: 02_15_put_column.sql /tenants/logs/$(SCHEMA)/02_13_set_default.test.log
/tenants/logs/$(SCHEMA)/02_15_put_column.test.log: 02_15_put_column.test.sql /tenants/logs/$(SCHEMA)/02_15_put_column.log
/tenants/logs/$(SCHEMA)/02_16_frmdb_get_reference_to.log: 02_16_frmdb_get_reference_to.sql /tenants/logs/$(SCHEMA)/02_15_put_column.test.log
/tenants/logs/$(SCHEMA)/02_16_put_column_REFERENCE_TO.log: 02_16_put_column_REFERENCE_TO.sql /tenants/logs/$(SCHEMA)/02_16_frmdb_get_reference_to.log
/tenants/logs/$(SCHEMA)/02_16_put_column_REFERENCE_TO.test.log: 02_16_put_column_REFERENCE_TO.test.sql /tenants/logs/$(SCHEMA)/02_16_put_column_REFERENCE_TO.log
/tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.log: 02_17_put_column_HLOOKUP.sql /tenants/logs/$(SCHEMA)/02_16_put_column_REFERENCE_TO.test.log
/tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.test.1.log: 02_17_put_column_HLOOKUP.test.1.sql /tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.log
/tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.test.2.enum.log: 02_17_put_column_HLOOKUP.test.2.enum.sql /tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.test.1.log
/tenants/logs/$(SCHEMA)/02_18_put_column_ROLLUP.log: 02_18_put_column_ROLLUP.sql /tenants/logs/$(SCHEMA)/02_17_put_column_HLOOKUP.test.2.enum.log
/tenants/logs/$(SCHEMA)/02_18_put_column_ROLLUP.test.log: 02_18_put_column_ROLLUP.test.sql /tenants/logs/$(SCHEMA)/02_18_put_column_ROLLUP.log
/tenants/logs/$(SCHEMA)/02_19_put_column_VLOOKUP.log: 02_19_put_column_VLOOKUP.sql /tenants/logs/$(SCHEMA)/02_18_put_column_ROLLUP.test.log
/tenants/logs/$(SCHEMA)/02_19_put_column_VLOOKUP.test.log: 02_19_put_column_VLOOKUP.test.sql /tenants/logs/$(SCHEMA)/02_19_put_column_VLOOKUP.log
/tenants/logs/$(SCHEMA)/03_16_put_table.log: 03_16_put_table.sql /tenants/logs/$(SCHEMA)/02_19_put_column_VLOOKUP.test.log
/tenants/logs/$(SCHEMA)/03_16_put_table.test.log: 03_16_put_table.test.sql /tenants/logs/$(SCHEMA)/03_16_put_table.log
/tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.log: 03_17_put_table_EXTENDS.sql /tenants/logs/$(SCHEMA)/03_16_put_table.test.log
/tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.computed_column.log: 03_17_put_table_EXTENDS.test.computed_column.sql /tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.log
/tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.reference.log: 03_17_put_table_EXTENDS.test.reference.sql /tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.computed_column.log
/tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.log: 03_17_put_table_EXTENDS.test.sql /tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.reference.log
/tenants/logs/$(SCHEMA)/03_19_put_table_MANY_TO_MANY.log: 03_19_put_table_MANY_TO_MANY.sql /tenants/logs/$(SCHEMA)/03_17_put_table_EXTENDS.test.log
/tenants/logs/$(SCHEMA)/03_19_put_table_MANY_TO_MANY.test.log: 03_19_put_table_MANY_TO_MANY.test.sql /tenants/logs/$(SCHEMA)/03_19_put_table_MANY_TO_MANY.log
/tenants/logs/$(SCHEMA)/03_21_put_table_GENERATED.log: 03_21_put_table_GENERATED.sql /tenants/logs/$(SCHEMA)/03_19_put_table_MANY_TO_MANY.test.log
/tenants/logs/$(SCHEMA)/03_21_put_table_GENERATED.test.log: 03_21_put_table_GENERATED.test.sql /tenants/logs/$(SCHEMA)/03_21_put_table_GENERATED.log
/tenants/logs/$(SCHEMA)/04_01_put_view.log: 04_01_put_view.sql /tenants/logs/$(SCHEMA)/03_21_put_table_GENERATED.test.log
/tenants/logs/$(SCHEMA)/04_01_put_view.test.log: 04_01_put_view.test.sql /tenants/logs/$(SCHEMA)/04_01_put_view.log
/tenants/logs/$(SCHEMA)/50_01_prw_table_columns.log: 50_01_prw_table_columns.sql /tenants/logs/$(SCHEMA)/04_01_put_view.test.log
/tenants/logs/$(SCHEMA)/50_02_frmdb_sp_table_columns.log: 50_02_frmdb_sp_table_columns.sql /tenants/logs/$(SCHEMA)/50_01_prw_table_columns.log
/tenants/logs/$(SCHEMA)/50_02_frmdb_sp_table_columns.test.log: 50_02_frmdb_sp_table_columns.test.sql /tenants/logs/$(SCHEMA)/50_02_frmdb_sp_table_columns.log
/tenants/logs/$(SCHEMA)/50_03_alerts.log: 50_03_alerts.sql /tenants/logs/$(SCHEMA)/50_02_frmdb_sp_table_columns.test.log
/tenants/logs/$(SCHEMA)/60_05_auth.log: 60_05_auth.sql /tenants/logs/$(SCHEMA)/50_03_alerts.log
/tenants/logs/$(SCHEMA)/60_05_auth.test.log: 60_05_auth.test.sql /tenants/logs/$(SCHEMA)/60_05_auth.log
/tenants/logs/$(SCHEMA)/60_06_frmdb.log: 60_06_frmdb.sql /tenants/logs/$(SCHEMA)/60_05_auth.test.log
/tenants/logs/$(SCHEMA)/60_06_prw_tables.log: 60_06_prw_tables.sql /tenants/logs/$(SCHEMA)/60_06_frmdb.log
/tenants/logs/$(SCHEMA)/60_06_prw_tables.test.log: 60_06_prw_tables.test.sql /tenants/logs/$(SCHEMA)/60_06_prw_tables.log
/tenants/logs/$(SCHEMA)/60_07_i18n.log: 60_07_i18n.sql /tenants/logs/$(SCHEMA)/60_06_prw_tables.test.log
/tenants/logs/$(SCHEMA)/99_end.log: 99_end.sql /tenants/logs/$(SCHEMA)/60_07_i18n.log
