const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", [
    check("username", "El nombre de usuario es obligatorio").notEmpty(),
    check("email", "El correo no es válido").isEmail(),
    check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
], authController.register);

router.post("/login", authController.login);

router.put("/role/:id", authController.cambiarRol);

module.exports = router;






