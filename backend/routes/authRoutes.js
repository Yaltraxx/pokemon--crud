const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", [
    check("username").isString().trim().notEmpty().isLength({ min: 3 }),
    check("password").isString().isLength({ min: 6 })
], authController.register);

router.post("/login", [
    check("username").isString().trim().notEmpty(),
    check("password").isString().notEmpty()
], authController.login);

module.exports = router;

