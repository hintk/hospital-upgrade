-- Increase password column length to accommodate BCrypt hashes (usually 60 chars)
-- Recommended length 100 to be safe

ALTER TABLE patient MODIFY COLUMN password VARCHAR(100) NOT NULL;
ALTER TABLE doctor MODIFY COLUMN password VARCHAR(100) NOT NULL;
ALTER TABLE admin MODIFY COLUMN password VARCHAR(100) NOT NULL;
