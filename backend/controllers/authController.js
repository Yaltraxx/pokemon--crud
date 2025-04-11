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
        await User.create({ username, password: hashedPassword, email, role: "usuario" });

        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error en el registro de usuario" });
    }
};

exports.login = async (req, res) => {
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({ message: "Inicio de sesión exitoso", token, role: usuario.role });
    } catch (error) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos del usuario" });
    }
};

exports.cambiarRol = async (req, res) => {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    if (!["admin", "usuario"].includes(nuevoRol)) {
        return res.status(400).json({ error: "Rol inválido" });
    }

    try {
        const usuario = await User.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        usuario.role = nuevoRol;
        await usuario.save();

        res.json({ message: `Rol actualizado a '${nuevoRol}' para el usuario '${usuario.username}'` });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el rol del usuario" });
    }
};





