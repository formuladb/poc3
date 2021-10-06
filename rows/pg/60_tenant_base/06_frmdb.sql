SELECT frmdb_put_table('prw_system_params', 'text');
SELECT frmdb_put_column('prw_system_params', 'val', 'text');

SELECT frmdb_put_table('prw_tables', 'text');
SELECT frmdb_put_column('prw_tables', 'parent', 'text');
SELECT frmdb_put_column('prw_tables', 'resource_type', 'text', '_and(is_not_null(resource_type), is_enum(resource_type, ''GROUP'', ''PAGE'', ''RESOURCE''))', '''RESOURCE''');
SELECT frmdb_put_column('prw_tables', 'icon', 'text', 'is_not_null(icon)');
SELECT frmdb_put_column('prw_tables', 'menu_order', 'integer', null, '0');
SELECT frmdb_put_column('prw_tables', 'options', 'json');

SELECT frmdb_put_table('prw_pages', 'text');
SELECT frmdb_put_column('prw_pages', 'prw_table_id', 'text');
SELECT frmdb_put_column('prw_pages', 'content', 'json');
SELECT frmdb_put_column('prw_pages', 'schema', 'json');

SELECT frmdb_put_table('frmdb_dictionary', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'en', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'fr', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'de', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'it', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'es', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'pl', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'el', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'ro', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'bg', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'da', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'sv', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'no', 'text');
SELECT frmdb_put_column('frmdb_dictionary', 'nl', 'text');
