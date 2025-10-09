import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidation, loginValidation } from "../validators/authValidations";

const router = Router();

// Registro
router.post("/register", registerValidation, validationMiddleware, registerUser);

// Login
router.post("/login", loginValidation, validationMiddleware, loginUser);

// POST /auth/logout → cerrar sesión
router.post("/logout", (req, res) => {
  // Si usas JWT en cookies:
  res.clearCookie("token"); // borra la cookie del token
  res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
});

export default router;