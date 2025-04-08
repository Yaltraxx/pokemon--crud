require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const pokemonRoutes = require("./routes/pokemonRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/pokemons", pokemonRoutes);
app.use("/api/auth", authRoutes);

sequelize.authenticate()
    .then(() => {
        console.log("✅ Conectado a MySQL con Sequelize");
        return sequelize.sync();
    })
    .then(() => {
        app.listen(5000, () => {
            console.log("🚀 Servidor corriendo en el puerto 5000");
        });
    })
    .catch(err => console.error("❌ Error al conectar con la base de datos:", err));
