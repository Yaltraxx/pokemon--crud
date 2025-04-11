const express = require("express");
const { check, validationResult } = require("express-validator");
const pokemonController = require("../controllers/pokemonController");
const authMiddleware = require("../config/middleware/authMiddleware");
const isAdmin = require("../config/middleware/isAdmin");

const router = express.Router();

router.get("/search", authMiddleware, pokemonController.searchPokemon);
router.get("/", authMiddleware, pokemonController.getPokemons);
router.get("/:id", authMiddleware, pokemonController.getPokemonById);

router.post(
    "/",
    authMiddleware,
    [
        check("nombre").notEmpty().withMessage("Nombre requerido"),
        check("tipo").notEmpty().withMessage("Tipo requerido"),
        check("nivel").isInt({ min: 1 }).withMessage("Nivel debe ser número positivo"),
        check("habilidades").notEmpty().withMessage("Habilidades requeridas"),
        check("peso").isFloat({ min: 0.1 }).withMessage("Peso inválido"),
        check("altura").isFloat({ min: 0.1 }).withMessage("Altura inválida"),
        check("genero").isIn(["Masculino", "Femenino", "Desconocido"]).withMessage("Género inválido"),
        check("region").isIn(["Kanto", "Johto", "Hoenn", "Sinnoh", "Teselia", "Kalos", "Alola", "Galar", "Paldea"]).withMessage("Región inválida")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errors.array() });
        }
        pokemonController.createPokemon(req, res).catch(next);
    }
);

router.put(
    "/:id",
    authMiddleware,
    isAdmin,
    [
        check("nombre").optional().isString().trim().escape(),
        check("tipo").optional().isString().trim().escape(),
        check("nivel").optional().isInt({ min: 1 }),
        check("habilidades").optional().isString().trim().escape(),
        check("peso").optional().isFloat({ min: 0.1 }),
        check("altura").optional().isFloat({ min: 0.1 }),
        check("genero").optional().isIn(["Masculino", "Femenino", "Desconocido"]),
        check("region").optional().isIn(["Kanto", "Johto", "Hoenn", "Sinnoh", "Teselia", "Kalos", "Alola", "Galar", "Paldea"])
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Datos inválidos", detalles: errors.array() });
        }
        pokemonController.updatePokemon(req, res).catch(next);
    }
);

router.delete("/:id", authMiddleware, isAdmin, pokemonController.deletePokemon);

module.exports = router;







