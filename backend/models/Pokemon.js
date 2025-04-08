const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pokemon = sequelize.define("Pokemon", {
    nombre: { type: DataTypes.STRING(50), allowNull: false, validate: { is: /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚÑñ.,-]+$/ } },
    tipo: { type: DataTypes.STRING(50), allowNull: false },
    nivel: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    habilidades: { type: DataTypes.STRING(255), allowNull: false },
    peso: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0.1 } },
    altura: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0.1 } },
    genero: { type: DataTypes.ENUM("Masculino", "Femenino", "Desconocido"), allowNull: false },
    region: { type: DataTypes.ENUM("Kanto", "Johto", "Hoenn", "Sinnoh", "Teselia", "Kalos", "Alola", "Galar", "Paldea"), allowNull: false }
});

module.exports = Pokemon;



