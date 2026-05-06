import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login",    validateLogin,    login);
router.post("/logout",   protect,          logout);

export default router;
