INSERT INTO users (id, username, pass, role) VALUES (2, 'oper1', 'pass1', 'operator')
ON CONFLICT(id) DO UPDATE SET username = EXCLUDED.username, pass = EXCLUDED.pass, role = EXCLUDED.role;
