INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.pages.name', 'Pages', 'Pagini'),
    ('resources.pages.fields.id', 'Id', 'Id'),
    ('resources.pages.fields.title', 'Title', 'Titlu'),
    ('resources.pages.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.pages.fields.created_by', 'Created By', 'Creat De'),
    ('resources.pages.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.pages.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('pages', 'text');
SELECT frmdb_put_column('pages', 'title', $$ text $$, 'is_not_null(title)', null);
--TODO schema.org SEO annotations

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.sections.name', 'Quiz Result Templates', 'Modele Rezultate Chestionare'),
    ('resources.sections.fields.id', 'Id', 'Id'),
    ('resources.sections.fields.title', 'Title', 'Titlu'),
    ('resources.sections.fields.subtitle', 'Subtitle', 'Sub Titlu'),
    ('resources.sections.fields.text', 'Text', 'Text'),
    ('resources.sections.fields.component', 'Component', 'Componentă'),
    ('resources.sections.fields.media_url', 'Media URL', 'Media URL'),
    ('resources.sections.fields.media_type', 'Media Type', 'Tip Media'),
    ('resources.sections.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.sections.fields.created_by', 'Created By', 'Creat De'),
    ('resources.sections.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.sections.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('sections');
SELECT frmdb_put_column_REFERENCE_TO('sections', 'page_id', 'pages', 'is_not_null(page_id)', null, 'CASCADE');
SELECT frmdb_put_column('sections', 'title', $$ text $$, 'is_not_null(title)', null);
SELECT frmdb_put_column('sections', 'subtitle', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'text', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'component', 'text', '_and(is_not_null(state), is_enum(state, ''COVER'', ''HEADER'', ''MEDIA'', ''CARDS'', ''CARDS2''))', '''MEDIA''');
SELECT frmdb_put_column('sections', 'media_url', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'media_type', $$ text $$, 'is_enum(state, ''IMAGE'', ''ICON'')', null);

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.subsections.name', 'Quiz Result Templates', 'Modele Rezultate Chestionare'),
    ('resources.subsections.fields.id', 'Id', 'Id'),
    ('resources.subsections.fields.title', 'Title', 'Titlu'),
    ('resources.subsections.fields.subtitle', 'Subtitle', 'Sub Titlu'),
    ('resources.subsections.fields.text', 'Text', 'Text'),
    ('resources.subsections.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.subsections.fields.created_by', 'Created By', 'Creat De'),
    ('resources.subsections.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.subsections.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('subsections');
SELECT frmdb_put_column_REFERENCE_TO('subsections', 'section_id', 'sections', 'is_not_null(section_id)', null, 'CASCADE');
SELECT frmdb_put_column('subsections', 'title', $$ text $$, 'is_not_null(title)', null);
SELECT frmdb_put_column('subsections', 'subtitle', $$ text $$, null, null);
SELECT frmdb_put_column('subsections', 'text', $$ text $$, null, null);
