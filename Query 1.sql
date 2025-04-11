CREATE DATABASE pokemon_db;
SELECT DATABASE();
CREATE TABLE pokemons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    nivel INT NOT NULL CHECK (nivel BETWEEN 1 AND 100),
    habilidades TEXT NOT NULL, 
    peso DECIMAL(5,2) NOT NULL,
    altura DECIMAL(5,2) NOT NULL,
    genero ENUM('Macho', 'Hembra', 'Desconocido') NOT NULL,
    region VARCHAR(50) NOT NULL
);
SHOW TABLES;
DESCRIBE pokemons;
SELECT user, host, authentication_string, plugin FROM mysql.user;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_nueva_contraseña';
FLUSH PRIVILEGES;
SELECT user, host, plugin FROM mysql.user;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON pokemon_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
SELECT user, host, authentication_string, plugin FROM mysql.user;
ALTER TABLE Pokemons ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Pokemons ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
USE pokemon_db; 
SELECT * FROM Pokemons;
SHOW CREATE TABLE pokemons;
ALTER TABLE pokemons MODIFY COLUMN genero VARCHAR(20);
SELECT * FROM pokemons;
SELECT user, host FROM mysql.user;
ALTER USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON pokemon_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
SELECT user, host FROM mysql.user;
ALTER USER 'root'@'localhost'
IDENTIFIED WITH mysql_native_password BY '123456';
FLUSH PRIVILEGES;
SELECT user, host FROM mysql.user;
ALTER USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
FLUSH PRIVILEGES;S;
DESCRIBE Users;
ALTER TABLE Users
ADD COLUMN role ENUM('admin', 'usuario') NOT NULL DEFAULT 'usuario';
ALTER TABLE Users
ADD COLUMN email VARCHAR(100) NOT NULL UNIQUE AFTER password;
INSERT INTO Users (username, password, email, role, createdAt, updatedAt)
VALUES (
  'adminTest',
  '$2b$10$0D7u9gZCm4SK2N4JrqUOjuyN6gdfN4T5k5t6ckCkNBsDeT/uxYfhK',
  'admin@test.com',
  'admin',
  NOW(),
  NOW()
);
INSERT INTO Users (username, password, email, role, createdAt, updatedAt)
VALUES (
  'usuarioTest',
  '$2b$10$k38lMDVu5hINHHZrLzJciOmYyVgAmmfwGHXKrfhEevTJGRKbsL1Li',
  'usuario@test.com',
  'usuario',
  NOW(),
  NOW()
);
SELECT * FROM Users;
INSERT INTO Users (username, password, email, role, createdAt, updatedAt)
VALUES (
  'AlmitaGod',
  '$2b$10$2Yzh7yrxoQfdLnxHPOYBheJrZkgPyFK68r0obvJ9OV51vlKfuVvtu',
  'almita@test.com',
  'admin',
  NOW(),
  NOW()
);
UPDATE Users
SET createdAt = NOW(), updatedAt = NOW()
WHERE username = 'AlmitaGod';
INSERT INTO Users (username, password, email, role, createdAt, updatedAt) VALUES (
  'Eljimmy',
  '$2b$10$xJAYBldWvTwkFMMjAFJ7ZebYr4efQeFbT6MubobWZPbOhqtCmT5Fq',
  'eljimmy@admin.com',
  'admin',
  NOW(),
  NOW()
);
SELECT * FROM Users WHERE username = 'Eljimmy';





