INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.pages.name', 'Pages', 'Pagini'),
    ('resources.pages.fields.id', 'Id', 'Id'),
    ('resources.pages.fields.tenant', 'Tenant', 'Tenant'),
    ('resources.pages.fields.name', 'Name', 'Nume'),
    ('resources.pages.fields.title', 'Title', 'Titlu'),
    ('resources.pages.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.pages.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.pages.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.pages.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('page', 'text');
SELECT frmdb_put_column('page', 'tenant', $$ text $$, 'is_not_null(tenant)', null);
SELECT frmdb_put_column('page', 'name', $$ text $$, null, null);
SELECT frmdb_put_column('page', 'title', $$ text $$, null, null);
--TODO schema.org SEO annotations

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.sections.name', 'Quiz Result Templates', 'Modele Rezultate Chestionare'),
    ('resources.sections.fields.id', 'Id', 'Id'),
    ('resources.sections.fields.title', 'Title', 'Titlu'),
    ('resources.sections.fields.subtitle', 'Subtitle', 'Sub Titlu'),
    ('resources.sections.fields.body', 'Body', 'Text'),
    ('resources.sections.fields.component', 'Component', 'Componentă'),
    ('resources.sections.fields.media_url', 'Media URL', 'Media URL'),
    ('resources.sections.fields.media_type', 'Media Type', 'Tip Media'),
    ('resources.sections.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.sections.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.sections.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.sections.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('sections', 'body');
SELECT frmdb_put_column('sections', 'tenant', $$ text $$, 'is_not_null(tenant)', null);
SELECT frmdb_put_column_REFERENCE_TO('sections', 'page_id', 'pages', 'is_not_null(page_id)', null, 'CASCADE');
SELECT frmdb_put_column('sections', 'name', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'title', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'subtitle', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'text', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'component', 'text', '_and(is_not_null(state), is_enum(state, ''COVER'', ''HEADER'', ''MEDIA'', ''CARDS_IMG'', ''CARDS_ICO''))', '''MEDIA''');
SELECT frmdb_put_column('sections', 'media_url', $$ text $$, null, null);
SELECT frmdb_put_column('sections', 'media_type', $$ text $$, 'is_enum(state, ''IMAGE'', ''ICON'')', null);

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.subsections.name', 'Quiz Result Templates', 'Modele Rezultate Chestionare'),
    ('resources.subsections.fields.id', 'Id', 'Id'),
    ('resources.subsections.fields.title', 'Title', 'Titlu'),
    ('resources.subsections.fields.subtitle', 'Subtitle', 'Sub Titlu'),
    ('resources.subsections.fields.text', 'Text', 'Text'),
    ('resources.subsections.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.subsections.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.subsections.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.subsections.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('subsections');
SELECT frmdb_put_column('subsections', 'tenant', $$ text $$, 'is_not_null(tenant)', null);
SELECT frmdb_put_column_REFERENCE_TO('subsections', 'section_id', 'sections', 'is_not_null(section_id)', null, 'CASCADE');
SELECT frmdb_put_column('subsections', 'title', $$ text $$, 'is_not_null(title)', null);
SELECT frmdb_put_column('subsections', 'subtitle', $$ text $$, null, null);
SELECT frmdb_put_column('subsections', 'text', $$ text $$, null, null);
