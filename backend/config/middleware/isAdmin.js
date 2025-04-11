const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers.authorization; 

    if (!token) {
        return res.status(403).json({ error: "Token requerido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.rol !== "admin") {
            return res.status(403).json({ error: "Acceso denegado: se requiere rol de administrador" });
        }
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};
