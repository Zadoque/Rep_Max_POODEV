CREATE UNIQUE INDEX uk_usuarios_email_ignore_case
    ON usuarios (LOWER(email));

ALTER TABLE usuarios
    DROP CONSTRAINT uk_usuarios_email;