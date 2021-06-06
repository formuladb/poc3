--#####################################################################
INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quizzes.name', 'Quizzes', 'Chestionare'),
    ('resources.quizzes.fields.id', 'Id', 'Id'),
    ('resources.quizzes.fields.points', 'Points', 'Puncte'),
    ('resources.quizzes.fields.score', 'Score', 'Scor'),
    ('resources.quizzes.fields.quiz_session_id', 'Quiz Session Id', 'Id Sesiune'),
    ('resources.quizzes.fields.quiz_session_id__.name', 'Quiz Session', 'Sesiune'),
    ('resources.quizzes.fields.quizz_template_id', 'Quiz Template Id', 'Id Model Chestionar'),
    ('resources.quizzes.fields.quizz_template_id__.name', 'Quiz Template', 'Model Chestionar'),
    ('resources.quizzes.fields.state', 'State', 'Stare'),
    ('quizzes__created_at__ck', 'Quiz Session Expired', 'Sesiunea a Expirat'),
    ('resources.quizzes.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.quizzes.fields.created_by', 'Created By', 'Creat De'),
    ('resources.quizzes.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quizzes.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

SELECT frmdb_put_table('quizzes');
SELECT frmdb_put_column_REFERENCE_TO('quizzes', 'quiz_session_id', 'quiz_sessions', 'is_not_null(quiz_session_id)', null);
SELECT frmdb_put_column_HLOOKUP('quizzes', 'quizz_template_id', 'quiz_session_id', 'quizz_template_id'); 
SELECT frmdb_put_column_REFERENCE_TO('quizzes', 'quizz_template_id', 'quiz_templates');
SELECT frmdb_put_column('quizzes', 'state', 'text', '_and(is_not_null(state), is_enum(state, ''IN_PROGRESS'', ''FINALIZED''))', '''IN_PROGRESS''');
SELECT frmdb_put_column_HLOOKUP('quizzes', 'session_start', 'quiz_session_id', 'session_start'); 
SELECT frmdb_put_column_HLOOKUP('quizzes', 'session_end', 'quiz_session_id', 'session_end'); 
SELECT frmdb_set_check('quizzes', 'created_at', $$ _AND(session_start <= created_at, created_at <= session_end) $$);

--quiz_sessions
SELECT frmdb_put_column_ROLLUP('quiz_sessions', 'nb_quizzes', 'quizzes', 'id', 'COUNT', 'quiz_session_id', 'true'); 
SELECT frmdb_set_check('quiz_sessions', 'nb_quizzes', $$ nb_quizzes <= max_nb_quizzes $$);


--#####################################################################
--# quizzes_results
--#####################################################################

INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quizzes_results__frmdbvw.name', 'Quizzes Results', 'Rezultate Chestionare'),
    ('resources.quizzes_results__frmdbvw.fields.id', 'Id', 'Id'),
    ('resources.quizzes_results__frmdbvw.fields.quizz_template_id__.name', 'Quiz Template', 'Model Chestionar'),
    ('resources.quizzes_results__frmdbvw.fields.state', '', ''),
    ('resources.quizzes_results__frmdbvw.fields.result_id__.title', '', ''),
    ('resources.quizzes_results__frmdbvw.fields.result_title', '', ''),
    ('resources.quizzes_results__frmdbvw.fields.result_details', '', ''),
    ('resources.quizzes_results__frmdbvw.fields.points', 'Points', 'Puncte'),
    ('resources.quizzes_results.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.quizzes_results.fields.created_by', 'Created By', 'Creat De'),
    ('resources.quizzes_results.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quizzes_results.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

-- SELECT frmdb_put_table_GENERATED (
--         p_table_name := 'quizzes_results', 
--         p_base_table := 'quizzes',
--         p_base_col_name := 'id',
--         p_sync_cols := '{"quizz_template_id", "quiz_session_id", "state"}'::varchar[]
-- );
-- SELECT frmdb_put_column_REFERENCE_TO('quizzes_results', 'quizz_template_id', 'quiz_templates');

--#####################################################################
--# quizzes__questions
--#####################################################################
SELECT frmdb_put_table_MANY2MANY('quizzes__questions', 'quizzes', 'qtmpl__questions');
SELECT frmdb_put_column_REFERENCE_TO('quizzes__questions', 'given_answer', 'qtmpl__questions__answers', 'is_not_null(given_answer)', null);
SELECT frmdb_put_column_HLOOKUP('quizzes__questions', 'points', 'given_answer', 'points');



--#####################################################################
--## quizzes_results table, new columns
--#####################################################################

CREATE OR REPLACE VIEW quizzes_results AS 
    SELECT *,
        (SELECT title FROM qtmpl__results WHERE qtmpl__results.id = _2.result_id) as result_title,
        (SELECT details FROM qtmpl__results WHERE qtmpl__results.id = _2.result_id) as result_details
    FROM (
        SELECT *,
            (
                SELECT id FROM qtmpl__results
                WHERE _AND(qtmpl__results.points_start <= _1.points, _1.points <= qtmpl__results.points_end)
            ) as result_id
        FROM (
            SELECT id,
                quizz_template_id,
                quiz_session_id,
                state,
                (
                    SELECT SUM(points) FROM quizzes__questions 
                    WHERE quizzes__questions.quizzes__id = quizzes.id
                ) as points       
            FROM quizzes 
        ) _1
    ) _2
;

-- SELECT frmdb_put_column_ROLLUP(
--     p_table_name := 'quizzes_results', 
--     p_col_name := 'points',
--     p_src_table := 'quizzes__questions',
--     p_src_rollup_col_name := 'points',
--     p_rollup_type := 'SUM',
--     p_src_ref_col_name := 'quizzes__id',
--     p_filter_expr := 'true'
-- );
-- SELECT frmdb_put_column_VLOOKUP(
--     p_table_name := 'quizzes_results', 
--     p_col_name := 'result_id',
--     p_src_table := 'qtmpl__results',
--     p_src_vlookup_col_name := 'id',
--     p_dst_join_col_name := 'quizz_template_id',
--     p_src_join_col_name := 'quizz_template_id',
--     p_filter_expr := $$  _AND(src.points_start <= dst.points, dst.points <= src.points_end) $$
-- );
-- SELECT frmdb_put_column_REFERENCE_TO('quizzes_results', 'result_id', 'qtmpl__results');
-- SELECT frmdb_put_column_HLOOKUP('quizzes_results', 'result_title', 'result_id', 'title');
-- SELECT frmdb_put_column_HLOOKUP('quizzes_results', 'result_details', 'result_id', 'details');
-- -- SELECT frmdb_put_column('quizzes_results', 'session_result', $$ text $$, null, null,  $$ CONCATENATE(quiz_session_id::text, '--', result_id::text) $$);


--#####################################################################
INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quiz_sessions_res__frmdbvw.name', 'Session Results', 'Rezultate Sesiune'),
    ('resources.quiz_sessions_res__frmdbvw.fields.id', 'Id', 'Id'),
    ('resources.quiz_sessions_res__frmdbvw.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.quiz_sessions_res__frmdbvw.fields.created_by', 'Created By', 'Creat De'),
    ('resources.quiz_sessions_res__frmdbvw.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quiz_sessions_res__frmdbvw.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

CREATE OR REPLACE VIEW quiz_sessions_res__frmdbvw AS 
    SELECT 'r' || quizzes_results.quiz_session_id::text || '/' || quizzes_results.result_id::text as id,
        MIN(quizzes_results.quiz_session_id) as quiz_session_id,
        MIN(quizzes_results.quizz_template_id) as quizz_template_id,
        MIN(quizzes_results.result_id) as result_id,
        MIN(qtmpl__results.title) as result_title,
        MIN(to_char(quiz_sessions.session_start, 'YYYY-MM-DD')) as session_start,
        COUNT(*)::integer as nb_quizzes
    FROM quizzes_results 
        INNER JOIN qtmpl__results ON quizzes_results.result_id = qtmpl__results.id
        INNER JOIN quiz_sessions ON quizzes_results.quiz_session_id = quiz_sessions.id
    WHERE quizzes_results.state = 'FINALIZED'
    GROUP BY 'r' || quiz_session_id::text || '/' || result_id::text
;

-- SELECT frmdb_put_table_GENERATED (
--         p_table_name := 'quiz_sessions__results', 
--         p_base_table := 'quizzes_results',
--         p_base_col_name := 'session_result',
--         p_sync_cols := '{"result_id"}'::varchar[]
-- );
-- SELECT frmdb_put_column_REFERENCE_TO('quiz_sessions__results', 'quizz_template_id', 'quiz_templates');
-- SELECT frmdb_put_column_REFERENCE_TO('quiz_sessions__results', 'result_id', 'qtmpl__results');
-- SELECT frmdb_put_column_ROLLUP(
--     p_table_name := 'quiz_sessions__results', 
--     p_col_name := 'nb_quizzes',
--     p_src_table := 'quizzes_results',
--     p_src_rollup_col_name := 'id',
--     p_rollup_type := 'COUNT',
--     p_src_ref_col_name := 'session_result',
--     p_filter_expr := 'true'
-- );

--#####################################################################
INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('resources.quiz_questions_frmdbvw.name', 'Quizzes', 'Chestionare'),
    ('resources.quiz_questions_frmdbvw.fields.id', 'Id', 'Id'),
    ('resources.quiz_questions_frmdbvw.fields.points', 'Points', 'Puncte'),
    ('resources.quiz_questions_frmdbvw.fields.score', 'Score', 'Scor'),
    ('resources.quiz_questions_frmdbvw.fields.question', 'Question', 'Întrebare'),
    ('resources.quiz_questions_frmdbvw.fields.given_answer', 'Choose Answer', 'Alege Răspuns'),
    ('resources.quiz_questions_frmdbvw.fields.position', 'Position', 'Poziție'),
    ('resources.quiz_questions_frmdbvw.fields.quiz_session_id', 'Quiz Session Id', 'Id Sesiune'),
    ('resources.quiz_questions_frmdbvw.fields.quiz_session_id__.name', 'Quiz Session', 'Sesiune'),
    ('resources.quiz_questions_frmdbvw.fields.quizz_template_id', 'Quiz Template Id', 'Id Model Chestionar'),
    ('resources.quiz_questions_frmdbvw.fields.quizz_template_id__.name', 'Quiz Template', 'Model Chestionar'),
    ('resources.quiz_questions_frmdbvw.fields.created_at', 'Created At', 'Data Creare'),
    ('resources.quiz_questions_frmdbvw.fields.created_by', 'Created By', 'Creat De'),
    ('resources.quiz_questions_frmdbvw.fields.updated_at', 'Updated At', 'Data Modificare'),
    ('resources.quiz_questions_frmdbvw.fields.updated_by', 'Updated By', 'Modificat De')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;

CREATE OR REPLACE VIEW quiz_questions_frmdbvw AS 
SELECT 
    COALESCE(qs.id, 
        qz.id::varchar || '--' || qt.id::varchar ---- id computed by MANY2MANY('quizzes__questions', 'quizzes', 'qtmpl__questions__id')
    ) as id,
    COALESCE(qs.quizzes__id, qz.id) as quizzes__id,
    COALESCE(qs.qtmpl__questions__id, qt.id) as qtmpl__questions__id,
    qs.given_answer,
    qs.points,
    qt.question,
    qt.position
    FROM quizzes qz
        INNER JOIN qtmpl__questions qt ON qz.quizz_template_id = qt.quizz_template_id
        LEFT OUTER JOIN quizzes__questions qs ON qz.id = qs.quizzes__id AND qt.id = qs.qtmpl__questions__id
    ORDER BY qt.position
;


CALL frmdb_internal_migrate_function('quiz_questions_frmdbvw_cud', $MIGR$
    CREATE OR REPLACE FUNCTION quiz_questions_frmdbvw_cud() RETURNS trigger AS
    $func$
    BEGIN
        IF (TG_OP = 'DELETE' ) THEN
            DELETE FROM quizzes__questions WHERE id = OLD.id;
            RETURN OLD;
        ELSIF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE')  THEN
            INSERT INTO quizzes__questions (
                quizzes__id,
                qtmpl__questions__id,
                given_answer
            ) VALUES (
                NEW.quizzes__id,
                NEW.qtmpl__questions__id,
                NEW.given_answer
            ) ON CONFLICT(id) DO UPDATE SET 
                quizzes__id = EXCLUDED.quizzes__id,
                qtmpl__questions__id = EXCLUDED.qtmpl__questions__id,
                given_answer = EXCLUDED.given_answer
            ;
            RETURN NEW;
        END IF;
    END;
    $func$ LANGUAGE plpgsql;
$MIGR$);

SELECT frmdb_set_trigger('quiz_questions_frmdbvw_cud_trg', 'quiz_questions_frmdbvw', $MIGR$
    CREATE TRIGGER quiz_questions_frmdbvw_cud_trg
    INSTEAD OF INSERT OR UPDATE OR DELETE ON quiz_questions_frmdbvw
    FOR EACH ROW
    EXECUTE PROCEDURE quiz_questions_frmdbvw_cud();
$MIGR$);
