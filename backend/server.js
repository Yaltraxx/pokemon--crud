const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const pokemonRoutes = require("./routes/pokemonRoutes");
const sequelize = require("./config/database");

const app = express();

app.use(cors({
  origin: "http://localhost:5501",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/pokemons", pokemonRoutes);

sequelize.authenticate()
  .then(() => console.log("Conexión a la base de datos exitosa"))
  .catch(err => console.error("Error al conectar con la base de datos:", err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
