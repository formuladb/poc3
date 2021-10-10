--Diacritice (ă â î ș ț) (Ă Â Î Ș Ț)
INSERT INTO prw_dictionary (id, en, ro) VALUES
    ('saved', 'Saved', 'Salvat'),
    ('page.configuration', 'Configuration', 'Configurare'),
    ('pos.language', 'Language', 'Limbă'),
    ('pos.theme.dark', 'Dark Theme', 'Tema Închisă'),
    ('pos.theme.light', 'Light Theme', 'Tema Deschisă'),
    ('pos.theme.name', 'Theme', 'Temă'),
    ('upload file', 'Upload File', 'Încarcă Fișier'),
    ('import', 'Import File', 'Import Fișier'),
    ('no elements yet', ' . . . (+ for adding)', ' . . . (+ pt a adăuga)'),

    ('i18n.loading', 'Loading', 'Se Încarcă'),

    ('resources.administer.name', 'Administration', 'Administrare'),
    ('resources.operate.name', 'Operations', 'Operare'),
    ('resources.public.name', 'Public', 'Public'),
    ('resources.reports.name', 'Repoarts', 'Rapoarte'),

    ('i18nt.exchange_rate', 'exchangeRate', 'Curs valutar')
ON CONFLICT(id) DO UPDATE SET en = EXCLUDED.en, ro = EXCLUDED.ro;
