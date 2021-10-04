INSERT INTO prw_tables (id, parent, icon, resource_type, menu_order, options) VALUES
    ('frmdb_homepage', '', '', 'PAGE', 0, '{"frmdb_anon": {"layoutType": "ONE_PAGE"}}'),
    ('prw_tables', 'TBD', 'List', 'RESOURCE', 0, null),
    ('prw_pages', 'TBD', 'List', 'RESOURCE', 0, null),
    ('administer', null, 'material-design-icons/settings', 'GROUP', 1, null),
    ('users', 'administer', 'material-design-icons/person', 'RESOURCE', 0, null),
    ('operate', null, 'material-design-icons/perm_data_setting', 'GROUP', 2, null),
    ('qtmpl__questions', '', '', 'RESOURCE', 0, null),
    ('qtmpl__questions__answers', '', ' ', 'RESOURCE', 0, null),
    ('qtmpl__results', '', '', 'RESOURCE', 0, null),
    ('quiz_templates', 'operate', 'material-design-icons/live_help', 'RESOURCE', 1, null),
    ('quiz_sessions', 'operate', 'material-design-icons/list_alt', 'RESOURCE', 2, null),
    ('public', null, 'material-design-icons/public', 'GROUP', 3, null),
    ('quizzes', 'public', 'material-design-icons/contact_support', 'RESOURCE', 0, '{"frmdb_anon": {"layoutType": "ONE_PAGE"}}'),
    ('quizzes_results', 'public', 'material-design-icons/playlist_add_check', 'RESOURCE', 1, '{"frmdb_anon": {"layoutType": "ONE_PAGE"}}'),
    ('quizzes__questions', '', '', 'RESOURCE', 0, null),
    ('quiz_questions_frmdbvw', '', '', 'RESOURCE', 0, null),
    ('quiz_sessions_res__frmdbvw', '', '', 'RESOURCE', 0, null),
    ('reports', null, 'material-design-icons/list_alt', 'GROUP', 4, null)
ON CONFLICT(id) DO UPDATE SET
    parent = EXCLUDED.parent, 
    icon = EXCLUDED.icon, 
    resource_type = EXCLUDED.resource_type,
    menu_order = EXCLUDED.menu_order,
    options = EXCLUDED.options
;
