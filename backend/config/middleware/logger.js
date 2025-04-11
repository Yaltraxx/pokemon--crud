const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "logs", "activity.log");

if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

function logger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const user = req.user?.id || "Invitado";
        const logLine = `[${new Date().toISOString()}] Usuario: ${user} | Método: ${req.method} | Ruta: ${req.originalUrl} | Estado: ${res.statusCode} | Duración: ${duration}ms\n`;

        fs.appendFile(logFile, logLine, err => {
            if (err) console.error("Error al escribir el log:", err);
        });
    });

    next();
}

function errorLogger(err, req, res, next) {
    const errorLog = `[${new Date().toISOString()}] ERROR en ${req.method} ${req.originalUrl}: ${err.message}\n`;
    fs.appendFile(logFile, errorLog, e => {
        if (e) console.error("Error al guardar el log de error:", e);
    });

    res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = { logger, errorLogger };
