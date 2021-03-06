SELECT frmdb_put_table('prw_system_params', 'text');
SELECT frmdb_put_column('prw_system_params', 'val', 'text');

SELECT frmdb_put_table('prw_tables', 'text');
SELECT frmdb_put_column('prw_tables', 'parent', 'text');
SELECT frmdb_put_column('prw_tables', 'resource_type', 'text', '_and(is_not_null(resource_type), is_enum(resource_type, ''GROUP'', ''PAGE'', ''RESOURCE''))', '''RESOURCE''');
SELECT frmdb_put_column('prw_tables', 'id_type', 'text', 'is_not_null(id_type)');
SELECT frmdb_put_column('prw_tables', 'icon', 'text', null);
SELECT frmdb_put_column('prw_tables', 'menu_order', 'integer', null, '0');
SELECT frmdb_put_column('prw_tables', 'options', 'json');

SELECT frmdb_put_table('prw_pages', 'text');
SELECT frmdb_put_column('prw_pages', 'prw_table_id', 'text');
SELECT frmdb_put_column('prw_pages', 'content', 'json');
SELECT frmdb_put_column('prw_pages', 'schema', 'json');

SELECT frmdb_put_table('prw_dictionary', 'text');
SELECT frmdb_put_column('prw_dictionary', 'en', 'text');
SELECT frmdb_put_column('prw_dictionary', 'fr', 'text');
SELECT frmdb_put_column('prw_dictionary', 'de', 'text');
SELECT frmdb_put_column('prw_dictionary', 'it', 'text');
SELECT frmdb_put_column('prw_dictionary', 'es', 'text');
SELECT frmdb_put_column('prw_dictionary', 'pl', 'text');
SELECT frmdb_put_column('prw_dictionary', 'el', 'text');
SELECT frmdb_put_column('prw_dictionary', 'ro', 'text');
SELECT frmdb_put_column('prw_dictionary', 'bg', 'text');
SELECT frmdb_put_column('prw_dictionary', 'da', 'text');
SELECT frmdb_put_column('prw_dictionary', 'sv', 'text');
SELECT frmdb_put_column('prw_dictionary', 'no', 'text');
SELECT frmdb_put_column('prw_dictionary', 'nl', 'text');
