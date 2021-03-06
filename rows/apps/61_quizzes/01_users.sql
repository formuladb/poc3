select frmdb_create_role('operator');
select frmdb_create_role('administrator');
select frmdb_create_role('enduser');
select frmdb_create_role('reviewer');


INSERT INTO prw_dictionary (id, en, ro) VALUES
    ('resources.users.name', 'Users', 'Utilizatori'),
    ('resources.users.fields.id', 'Id', 'Id'),
    ('resources.users.fields.code', 'Code', 'Cod'),
    ('resources.users.fields.state', 'State', 'Stare'),
    ('resources.users.fields.username', 'Name', 'Nume'),
    ('resources.users.fields.role', 'Role', 'Role'),
    ('resources.users.fields.pass', 'Pass', 'Pass'),
    ('resources.users.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.users.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.users.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.users.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

select frmdb_put_table_EXTENDS('users', 'prw_users', '{"username", "pass", "role"}');
