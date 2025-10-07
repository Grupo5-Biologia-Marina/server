import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidation, loginValidation } from "../validators/authValidations";

const router = Router();

// Registro
router.post("/register", registerValidation, validationMiddleware, registerUser);

// Login
router.post("/login", loginValidation, validationMiddleware, loginUser);

export default router;