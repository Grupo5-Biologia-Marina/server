import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

// POST /auth/register → registrar usuario
router.post("/register", registerUser);

// POST /auth/login → iniciar sesión
router.post("/login", loginUser);

export default router;