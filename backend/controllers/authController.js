const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.register = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ error: "Datos inválidos", detalles: errores.array() });
    }

    const { username, password, email } = req.body;

    try {
        const usuarioExistente = await User.findOne({ where: { username } });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await User.create({ username, password: hashedPassword, email });

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
};

exports.login = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ error: "Datos inválidos", detalles: errores.array() });
    }

    const { username, password } = req.body;

    try {
        const usuario = await User.findOne({ where: { username } });
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};


