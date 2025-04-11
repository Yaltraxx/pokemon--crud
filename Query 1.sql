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






