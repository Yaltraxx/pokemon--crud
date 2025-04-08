const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pokemon_db", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
    freezeTableName: true
  }
});

module.exports = sequelize;


  




