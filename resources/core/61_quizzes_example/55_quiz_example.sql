SELECT setval('qtmpl__questions_id_seq', 500, true);  
SELECT setval('quiz_templates_id_seq', 500, true);  
SELECT setval('qtmpl__questions__answers_id_seq', 500, true);  
SELECT setval('quiz_sessions_id_seq', 500, true);  
SELECT setval('quizzes_id_seq', 500, true);  


INSERT INTO quiz_templates (id, name, description)
VALUES (1, 'Exemplu Testarea Emotiilor', 'Testul emotiilor iti dezvaluie daca ai o atitudine sanatoasa vis-a-vis de propriile emotii.')
ON CONFLICT(id) DO UPDATE SET 
    name = EXCLUDED.name, 
    description = EXCLUDED.description
;
INSERT INTO qtmpl__results (id, quizz_template_id, points_start, points_end, title, details)
VALUES 
(1, 1, 0, 1, 'Rezultat I', 'detalii despre resultatul de tip I, reomandari, sugestii, etc'), 
(2, 1, 2, 2, 'Rezultat tip II', 'detalii despre rezultatul de tip II, bla bla bla bla adsca dcbala'), 
(3, 1, 3, 500, 'Rezultat III', 'detalii III, lorem ipsum sim dolores ads a asd c asd ca sdc as dca dc ad a')
ON CONFLICT(id) DO UPDATE SET 
    quizz_template_id = EXCLUDED.quizz_template_id,
    points_start = EXCLUDED.points_start,
    points_end = EXCLUDED.points_end,
    title = EXCLUDED.title,
    details = EXCLUDED.details
;


INSERT INTO qtmpl__questions (id, quizz_template_id, question, position) VALUES 
(1, 1, 'Te simti vinovat/a daca plangi in public?', 1),
(2, 1, 'Crezi ca plansul este un semn de slabiciune?', 2),
(3, 1, 'Crezi ca barbatii si baietii ar trebui sa fie incurajati sa-si stapaneasca lacrimile?', 3),
(4, 1, 'Te rusinezi daca plangi in timp ce citesti o carte sau privesti un film?', 4),
(5, 1, 'Daca ai participala o inmormantare ai incerca sa-ti stapanesti lacrimile?', 5),
(6, 1, 'Ai avea incredere intr-un politician care plange in public?', 6),
(7, 1, 'Crezi ca lacrimile reprezinta o exprimare inutila a emotiilor?', 7),
(8, 1, 'Incerci sa-ti ascunzi dezamagirea de fiecare data?', 8),
(9, 1, 'Te simti jenat/a daca vezi un om in toata firea plangand?', 9),
(10, 1, 'Daca ai incepe sa plangi din senin ai pretinde ca ti-a intrat ceva in ochi?', 10),
(11, 1, 'Incerci sa-ti ascunzi furia de fiecare data?', 11),
(12, 1, 'Ai tendinta de a te gandi la lucrurile care te infurie?', 12),
(13, 1, 'Ti-a scapat vreodata furia de sub control?', 13),
(14, 1, 'Ai intrat vreodata in bucluc datorita temperamentului?', 14),
(15, 1, 'Crezi ca iti face bine sa te eliberezi de sentimentele de furie?', 15),
(16, 1, 'Ai permite cuiva sa te consoleze atunci cand plangi?', 16),
(17, 1, 'Te superi repede?', 17),
(18, 1, 'Atingi persoana iubita cel putin o data pe zi?', 18),
(19, 1, 'Iti face placere manifestarea fizica a afectiunii?', 19),
(20, 1, 'Esti vreodata contemplativ/a in prezenta bebelusilor?', 20),
(21, 1, 'Te-ai tine de mana in public cu cineva la care tii?', 21),
(22, 1, 'Iti place sa fii masat/a?', 22),
(23, 1, 'Le spui in mod regulat ce simti celor la care tii?', 23),
(24, 1, 'Ai avut vreodata un animal de casa la care sa tii foarte mult?', 24),
(25, 1, 'Iti place sa fii imbratisat/a si sarutat/a de catre oamenii pe care ii iubesti?', 25),
(26, 1, 'Razi vreodata cu pofta la comedii?', 26),
(27, 1, 'Bati vreodata ritmul cu degetele atunci cand asculti muzica?', 27),
(28, 1, 'Ti s-a intamplat deseori sa fii ultimul care bate din palme la concerte sau spectacole?', 28),
(29, 1, 'Iti incurajezi vreodata echipa cu voce tare atunci cand privesti un meci la televizor?', 29),
(30, 1, 'Iti amintesti ultima data cand ai ras cu adevarat si te-ai distrat de minune?', 30)
ON CONFLICT(id) DO UPDATE SET 
    quizz_template_id = EXCLUDED.quizz_template_id, 
    question = EXCLUDED.question, 
    position = EXCLUDED.position
;

DO $$
DECLARE
	v_rec RECORD;
BEGIN
    FOR v_rec IN SELECT * FROM qtmpl__questions WHERE quizz_template_id = 1
    LOOP
        INSERT INTO qtmpl__questions__answers ( id, qtmpl__questions__id, answer, position, points) VALUES 
            (v_rec.id * 10 + 1, v_rec.id, 'Da - ' || v_rec.id || '-' || md5(random()::text), 1, 2),
            (v_rec.id * 10 + 2, v_rec.id, 'Poate - ' || v_rec.id || '-' || md5(random()::text), 2, 1),
            (v_rec.id * 10 + 3, v_rec.id, 'Nu - ' || v_rec.id || '-' || md5(random()::text), 3, 0),
            (v_rec.id * 10 + 4, v_rec.id, 'Posibil - ' || v_rec.id || '-' || md5(random()::text), 4, 0),
            (v_rec.id * 10 + 5, v_rec.id, 'Nu stiu - ' || v_rec.id || '-' || md5(random()::text), 5, 0)
        ON CONFLICT(id) DO UPDATE SET 
            qtmpl__questions__id = EXCLUDED.qtmpl__questions__id, 
            answer = EXCLUDED.answer, 
            position = EXCLUDED.position,
            points = EXCLUDED.points
        ;
    END LOOP;
END $$;

WITH upd1 AS (
    UPDATE quizzes SET created_at = now() WHERE id < 500 --check constraint on created_at
) INSERT INTO quiz_sessions (id, name, quizz_template_id, session_start, session_end, max_nb_quizzes) VALUES
        (1, 'Emotii Sesiunea 1', 1, now() - INTERVAL '15 days', now() + INTERVAL '1 days', 50),
        (2, 'Emotii Sesiunea 1', 1, now() - INTERVAL '10 days', now() + INTERVAL '2 days', 50),
        (3, 'Emotii Sesiunea 1', 1, now() - INTERVAL '5 days', now() + INTERVAL '2 days', 50),
        (4, 'Emotii Sesiunea 1', 1, now() - INTERVAL '2 days', now() + INTERVAL '2 days', 50)
    ON CONFLICT(id) DO UPDATE SET 
        name = EXCLUDED.name,
        quizz_template_id = EXCLUDED.quizz_template_id,
        session_start = EXCLUDED.session_start,
        session_end = EXCLUDED.session_end,
        max_nb_quizzes = EXCLUDED.max_nb_quizzes
;


DO $$
DECLARE
	v_sess_id integer;
BEGIN
    FOREACH v_sess_id IN ARRAY ARRAY[1, 2, 3, 4]
    LOOP

        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 1, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 1, 1, 11), (v_sess_id * 100 + 1, 2, 23) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 2, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 2, 1, 11), (v_sess_id * 100 + 2, 2, 2*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 3, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 3, 1, 11), (v_sess_id * 100 + 3, 2, 2*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 4, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 4, 1, 11), (v_sess_id * 100 + 4, 2, 2*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;

        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 11, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 11, 4, 42), (v_sess_id * 100 + 11, 5, 5*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 12, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 12, 4, 42), (v_sess_id * 100 + 12, 5, 5*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 13, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 13, 4, 42), (v_sess_id * 100 + 13, 5, 5*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 14, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 14, 4, 42), (v_sess_id * 100 + 14, 5, 5*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 15, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 15, 4, 42), (v_sess_id * 100 + 15, 5, 5*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 16, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 16, 4, 42), (v_sess_id * 100 + 16, 5, 53) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 17, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 17, 4, 42), (v_sess_id * 100 + 17, 5, 53) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 18, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 18, 4, 42), (v_sess_id * 100 + 18, 5, 53) ON CONFLICT(id) DO NOTHING;

        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 21, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 21, 4, 41), (v_sess_id * 100 + 21, 5, 52) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes(id, quiz_session_id) VALUES (v_sess_id * 100 + 22, v_sess_id) ON CONFLICT(id) DO NOTHING;
        INSERT INTO quizzes__questions (quizzes__id, qtmpl__questions__id, given_answer)
            VALUES (v_sess_id * 100 + 22, 4, 41), (v_sess_id * 100 + 22, 5, 1*10 + v_sess_id) ON CONFLICT(id) DO NOTHING;

        UPDATE quizzes SET state = 'FINALIZED';

    END LOOP;
END $$;
