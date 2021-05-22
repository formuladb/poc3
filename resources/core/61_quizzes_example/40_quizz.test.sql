BEGIN;
    SELECT plan( 22 );

    INSERT INTO users (id, username, pass, role)
        VALUES (1, 'enduser1', 'pass1', 'enduser');
    SELECT results_eq(
        $$ SELECT username, pass FROM frmdb_users $$,
        $$ VALUES ( 'enduser1'::varchar, 'frmdb_encrypted:a722c63db8ec8625af6cf71cb8c2d939'::varchar ) $$
    );

    INSERT INTO users (id, username, pass, role)
        VALUES (2, 'oper1', 'pass1', 'operator');
    SELECT results_eq(
        $$ SELECT username, pass FROM frmdb_users WHERE id = 2 $$,
        $$ VALUES ( 'oper1'::varchar, 'frmdb_encrypted:a722c63db8ec8625af6cf71cb8c2d939'::varchar ) $$
    );

    SELECT frmdb_sql_unit_test_login('oper1', 'pass1');

    --########################################################################
    --# Define test template
    --########################################################################

    INSERT INTO quiz_templates (id, name, description, cover_image)
    VALUES (1, 'quiz1', 'quiz 1 desctiptions', 'quiz-2432440_1280.png');
    INSERT INTO qtmpl__results (id, quizz_template_id, points_start, points_end, title, details)
    VALUES (1, 1, 1, 1, 'res1', 'details 1'), (2, 1, 2, 2, 'res2', 'details 2'), (3, 1, 3, 3, 'res3', 'details 3');


    INSERT INTO qtmpl__questions (id, quizz_template_id, question, position)
        VALUES (101, 1, 'quiz 1 question 11111111', 1);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10101, 101, 'quiz 1 question 11111111 answer 1', 1, 0);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10102, 101, 'quiz 1 question 11111111 answer 2', 2, 5);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10103, 101, 'quiz 1 question 11111111 answer 3', 3, 1);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10104, 101, 'quiz 1 question 11111111 answer 4', 4, 0);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10105, 101, 'quiz 1 question 11111111 answer 5', 5, 0);


    INSERT INTO qtmpl__questions (id, quizz_template_id, question, position)
        VALUES (102, 1, 'quiz 1 question 2', 1);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10201, 102, 'quiz 1 question 2 answer 1', 1, 0);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10202, 102, 'quiz 1 question 2 answer 2', 2, 1);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10203, 102, 'quiz 1 question 2 answer 3', 3, 0);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10204, 102, 'quiz 1 question 2 answer 4', 4, 0);
    INSERT INTO qtmpl__questions__answers (id, qtmpl__questions__id, answer, position, points)
        VALUES (10205, 102, 'quiz 1 question 2 answer 5', 5, 0);

    SELECT results_eq(
        $$ SELECT id, nb_questions, max_points FROM quiz_templates $$,
        $$ VALUES ( 1, 2, 7 ) $$
    );

    INSERT INTO quiz_sessions (id, name, quizz_template_id, session_start, session_end, max_nb_quizzes)
        VALUES (11, 'Sess 11', 1, now() - interval '5 days', now(), 2);
    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions $$,
        $$ VALUES ( 11, 0 ) $$
    );

    --########################################################################
    --# Take a test
    --########################################################################

    SELECT frmdb_sql_unit_test_logout();
    SELECT frmdb_sql_unit_test_login_anon();

    INSERT INTO quizzes(id, quiz_session_id) VALUES (111, 11);
    SELECT results_eq(
        $$ SELECT id, quizz_template_id FROM quizzes $$,
        $$ VALUES ( 111, 1 ) $$
    );
    SELECT is_empty($$ SELECT id, nb_quizzes FROM quiz_sessions_res__frmdbvw ORDER BY id $$);

    INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
        VALUES (111, 101, 10101);
    SELECT results_eq(
        $$ SELECT id, points FROM quizzes__questions $$,
        $$ VALUES ( '111--101'::varchar, 0) $$
    );
    SELECT id, points, coalesce(result_title, 'bla') from quizzes_results;
    SELECT results_eq(
        $$ SELECT id::integer, points::integer, coalesce(result_title, 'bla') FROM quizzes_results $$,
        $$ VALUES ( 111::integer, 0::integer, 'bla'::text) $$
    );

    INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
        VALUES (111, 102, 10202);
    SELECT results_eq(
        $$ SELECT id, points FROM quizzes__questions ORDER BY id $$,
        $$ VALUES ( '111--101'::varchar, 0), ( '111--102'::varchar, 1) $$
    );

    --########################################################################
    --# Read detailed result
    --########################################################################

    SELECT id, points from quizzes_results;
    SELECT results_eq(
        $$ SELECT id::integer, points::integer, result_title::text FROM quizzes_results $$,
        $$ VALUES ( 111::integer, 1::integer, 'res1'::text) $$
    );
    SELECT is_empty($$ SELECT id, nb_quizzes FROM quiz_sessions_res__frmdbvw ORDER BY id $$);
    UPDATE quizzes SET state = 'FINALIZED' WHERE id = 111;
    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions_res__frmdbvw ORDER BY id $$,
        $$ VALUES ( 'r11/1'::text, 1 ) $$
    );
    SELECT results_eq(
        $$ SELECT id::integer, points::integer, result_title::text FROM quizzes_results $$,
        $$ VALUES ( 111::integer, 1::integer, 'res1'::text) $$
    );
    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions $$,
        $$ VALUES ( 11, 1 ) $$
    );

    UPDATE quizzes__questions SET given_answer = 10103 
        WHERE quizzes__id = 111 AND qtmpl__questions__id = 101;
    SELECT results_eq(
        $$ SELECT id, points FROM quizzes__questions ORDER BY id $$,
        $$ VALUES ( '111--101'::varchar, 1), ('111--102',1) $$
    );
    SELECT results_eq(
        $$ SELECT id::integer, points::integer, result_title FROM quizzes_results $$,
        $$ VALUES ( 111::integer, 2::integer, 'res2') $$
    );
    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions_res__frmdbvw ORDER BY id $$,
        $$ VALUES ( 'r11/2'::text, 1 ) $$
    );
    
    INSERT INTO quizzes(id, quiz_session_id) VALUES (112, 11);
    SELECT results_eq(
        $$ SELECT id, quizz_template_id FROM quizzes ORDER BY ID $$,
        $$ VALUES ( 111, 1 ), ( 112, 1 ) $$
    );
    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions $$,
        $$ VALUES ( 11, 2 ) $$
    );    

    SELECT results_eq(
        $$ SELECT id, nb_quizzes FROM quiz_sessions_res__frmdbvw ORDER BY id $$,
        $$ VALUES ( 'r11/2'::text, 1 ) $$
    );

    PREPARE my_thrower AS INSERT INTO quizzes(id, quiz_session_id) VALUES (113, 11);
    SELECT throws_ilike(
        'my_thrower',
        '%quiz_sessions__nb_quizzes__ck%'
    );
    PREPARE my_thrower2 AS INSERT INTO quizzes(id, quiz_session_id, created_at) VALUES (113, 11, now() + INTERVAL '5 days');
    SELECT throws_ilike(
        'my_thrower2',
        '%quizzes__created_at__ck%'
    );

    --########################################################################
    --# Session Validation
    --########################################################################


    SELECT * FROM finish();
    SELECT * FROM frmdb_check_nb_failures();
ROLLBACK;
