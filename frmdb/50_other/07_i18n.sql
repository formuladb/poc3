--Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
--truncate table frmdb_dictionary
INSERT INTO frmdb_dictionary (id, en, ro) VALUES
    ('saved', 'Saved', 'Salvat'),
    ('page.configuration', 'Configuration', 'Configurare'),
    ('pos.language', 'Language', 'Limbă'),
    ('pos.theme.dark', 'Dark Theme', 'Tema Închisă'),
    ('pos.theme.light', 'Light Theme', 'Tema Deschisă'),
    ('pos.theme.name', 'Theme', 'Temă'),
    ('upload file', 'Upload File', 'Încarcă Fișier'),
    ('import', 'Import File', 'Import Fișier'),
    ('i18n.loading', 'Loading', 'Se Încarcă'),
    ('frmdb.action.next', 'Next', 'Următorul'),
    ('frmdb.action.finalize', 'Finalize', 'Finalizare'),
    ('no elements yet', ' . . . (+ for adding)', ' . . . (+ pt a adăuga)')
ON CONFLICT(id) DO UPDATE SET
    en = EXCLUDED.en, 
    ro = EXCLUDED.ro
;
