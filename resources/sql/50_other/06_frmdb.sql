SELECT frmdb_put_table('frmdb_system_params', 'varchar');
SELECT frmdb_put_column('frmdb_system_params', 'val', 'varchar');

SELECT frmdb_put_table('frmdb_resources', 'varchar');
SELECT frmdb_put_column('frmdb_resources', 'parent', 'varchar');
SELECT frmdb_put_column('frmdb_resources', 'resource_type', 'text', '_and(is_not_null(resource_type), is_enum(resource_type, ''PAGE'', ''RESOURCE''))', '''RESOURCE''');
SELECT frmdb_put_column('frmdb_resources', 'icon', 'character varying', 'is_not_null(icon)');
SELECT frmdb_put_column('frmdb_resources', 'menu_order', 'integer', null, '0');

SELECT frmdb_put_table('frmdb_pages', 'varchar');
SELECT frmdb_put_column('frmdb_pages', 'content', 'json');

SELECT frmdb_put_table('frmdb_dictionary', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'en', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'fr', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'de', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'it', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'es', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'pl', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'el', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'ro', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'bg', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'da', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'sv', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'no', 'varchar');
SELECT frmdb_put_column('frmdb_dictionary', 'nl', 'varchar');
