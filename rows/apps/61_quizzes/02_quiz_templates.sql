INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quiz_templates.name', 'Quiz Templates', 'Modele Chestionar'),
    ('resources.quiz_templates.fields.id', 'Id', 'Id'),
    ('resources.quiz_templates.fields.name', 'Name', 'Nume'),
    ('resources.quiz_templates.fields.description', 'Description', 'Descriere'),
    ('resources.quiz_templates.fields.nb_questions', 'Nb Questions', 'Nr Intrebari'),
    ('resources.quiz_templates.fields.max_points', 'Max Points', 'Nr Maxim Puncte'),
    ('resources.quiz_templates.fields.cover_image', 'Image', 'Imagine'),
    ('resources.quiz_templates.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.quiz_templates.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.quiz_templates.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quiz_templates.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('quiz_templates');
SELECT frmdb_put_column('quiz_templates', 'name', $$ text $$, 'is_not_null(name)', null);
SELECT frmdb_put_column('quiz_templates', 'description', $$ text $$, 'is_not_null(description)', null);
SELECT frmdb_put_column('quiz_templates', 'cover_image', $$ text $$);


INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.qtmpl__results.name', 'Quiz Result Templates', 'Modele Rezultate Chestionare'),
    ('resources.qtmpl__results.fields.id', 'Id', 'Id'),
    ('resources.qtmpl__results.fields.quizz_template_id', 'Quiz Templates', 'Modele Chestionar'),
    ('resources.qtmpl__results.fields.points_start', 'Points Start', 'Interval Puncte Start'),
    ('resources.qtmpl__results.fields.points_end', 'Points End', 'Interval Puncte End'),
    ('resources.qtmpl__results.fields.title', 'Title', 'Titlu'),
    ('resources.qtmpl__results.fields.details', 'Details', 'Detalii'),
    ('resources.qtmpl__results.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.qtmpl__results.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.qtmpl__results.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.qtmpl__results.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('qtmpl__results');
SELECT frmdb_put_column_REFERENCE_TO('qtmpl__results', 'quizz_template_id', 'quiz_templates', 'is_not_null(quizz_template_id)', null, 'CASCADE');
SELECT frmdb_put_column('qtmpl__results', 'points_start', $$ integer $$, 'is_not_null(points_start)', null);
SELECT frmdb_put_column('qtmpl__results', 'points_end', $$ integer $$, 'is_not_null(points_end)', null);
SELECT frmdb_put_column('qtmpl__results', 'title', $$ text $$, 'is_not_null(title)', null);
SELECT frmdb_put_column('qtmpl__results', 'details', $$ text $$,'is_not_null(details)');


INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.qtmpl__questions.name', 'Question Templates', 'Modele Întrebări'),
    ('resources.qtmpl__questions.fields.id', 'Id', 'Id'),
    ('resources.qtmpl__questions.fields.quizz_template_id', 'Quizz Template Id', 'Id Model Chestionar'),
    ('resources.qtmpl__questions.fields.quizz_template_id__.name', 'Quizz Template', 'Model Chestionar'),
    ('resources.qtmpl__questions.fields.question', 'Question', 'Întrebare'),
    ('resources.qtmpl__questions.fields.position', 'Position', 'Poziție'),
    ('resources.qtmpl__questions.fields.max_points', 'Max Points', 'Nr Maxim Puncte'),
    ('resources.qtmpl__questions.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.qtmpl__questions.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.qtmpl__questions.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.qtmpl__questions.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('qtmpl__questions');
SELECT frmdb_put_column_REFERENCE_TO('qtmpl__questions', 'quizz_template_id', 'quiz_templates', 'is_not_null(quizz_template_id)', null, 'CASCADE');
SELECT frmdb_put_column('qtmpl__questions', 'question', $$ text $$, 'is_not_null(question)', null);
SELECT frmdb_put_column('qtmpl__questions', 'position', $$ double precision $$, 'is_not_null(position)', null);



INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.qtmpl__questions__answers.name', 'Question Templates', 'Modele Răspunsuri'),
    ('resources.qtmpl__questions__answers.fields.id', 'Id', 'Id'),
    ('resources.qtmpl__questions__answers.fields.answer', 'Answer', 'Răspuns'),
    ('resources.qtmpl__questions__answers.fields.position', 'Position', 'Poziție'),
    ('resources.qtmpl__questions__answers.fields.points', 'Points', 'Puncte'),
    ('resources.qtmpl__questions__answers.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.qtmpl__questions__answers.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.qtmpl__questions__answers.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.qtmpl__questions__answers.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('qtmpl__questions__answers');
SELECT frmdb_put_column_REFERENCE_TO('qtmpl__questions__answers', 'qtmpl__questions__id', 'qtmpl__questions', 'is_not_null(qtmpl__questions__id)', null, 'CASCADE');
SELECT frmdb_put_column('qtmpl__questions__answers', 'answer', $$ text $$, 'is_not_null(answer)', null);
SELECT frmdb_put_column('qtmpl__questions__answers', 'position', $$ double precision $$, 'is_not_null(position)', null);
SELECT frmdb_put_column('qtmpl__questions__answers', 'points', $$ integer $$, 'is_not_null(points)', null);


SELECT frmdb_put_column_ROLLUP(
    p_table_name := 'qtmpl__questions', 
    p_col_name := 'max_points',
    p_src_table := 'qtmpl__questions__answers',
    p_src_rollup_col_name := 'points',
    p_rollup_type := 'SUM',
    p_src_ref_col_name := 'qtmpl__questions__id',
    p_filter_expr := 'true'
);
SELECT frmdb_put_column_ROLLUP(
    p_table_name := 'quiz_templates', 
    p_col_name := 'nb_questions',
    p_src_table := 'qtmpl__questions',
    p_src_rollup_col_name := 'id',
    p_rollup_type := 'COUNT',
    p_src_ref_col_name := 'quizz_template_id',
    p_filter_expr := 'true'
);
SELECT frmdb_put_column_ROLLUP(
    p_table_name := 'quiz_templates', 
    p_col_name := 'max_points',
    p_src_table := 'qtmpl__questions',
    p_src_rollup_col_name := 'max_points',
    p_rollup_type := 'SUM',
    p_src_ref_col_name := 'quizz_template_id',
    p_filter_expr := 'true'
);

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quiz_sessions.name', 'Quiz Sessions', 'Sesiuni'),
    ('resources.quiz_sessions.fields.id', 'Id', 'Id'),
    ('resources.quiz_sessions.fields.name', 'Name', 'Nume'),
    ('resources.quiz_sessions.fields.quizz_template_id', 'Quizz Template Id', 'Id Model Chestionar'),
    ('resources.quiz_sessions.fields.quizz_template_id__.name', 'Quizz Template', 'Model Chestionar'),
    ('resources.quiz_sessions.fields.question', 'Question', 'Întrebare'),
    ('resources.quiz_sessions.fields.session_start', 'Session Start', 'Data Început Sesiune'),
    ('resources.quiz_sessions.fields.session_end', 'Session End', 'Data Sfarșit Sesiune'),
    ('resources.quiz_sessions.fields.max_nb_quizzes', 'Max Nb Quizzes', 'Nr Maxim Respondenți'),
    ('resources.quiz_sessions.fields.url__share', 'Share Link', 'Link'),
    ('resources.quiz_sessions.fields.nb_quizzes', 'Nb Quizzes', 'Nr Respondenți'),
    ('resources.quiz_sessions.fields.meta_created_at', 'Created At', 'Data Creare'),
    ('resources.quiz_sessions.fields.meta_created_by', 'Created By', 'Creat De'),
    ('resources.quiz_sessions.fields.meta_updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quiz_sessions.fields.meta_updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('quiz_sessions');
SELECT frmdb_put_column('quiz_sessions', 'name', $$ text $$, 'is_not_null(name)', null);
SELECT frmdb_put_column_REFERENCE_TO('quiz_sessions', 'quizz_template_id', 'quiz_templates', 'is_not_null(quizz_template_id)', null);
SELECT frmdb_put_column('quiz_sessions', 'session_start', $$ timestamp with time zone $$, 'is_not_null(session_start)', null);
SELECT frmdb_put_column('quiz_sessions', 'session_end', $$ timestamp with time zone $$, 'is_not_null(session_end)', null);
SELECT frmdb_put_column('quiz_sessions', 'max_nb_quizzes', $$ integer $$, 'is_not_null(max_nb_quizzes)', null);
SELECT frmdb_put_column('quiz_sessions', 'url__share', $$ text $$, null, null,  $$ CONCATENATE('/prws/quizzes/create?state=IN_PROGRESS&quiz_session_id=', id::text) $$);
