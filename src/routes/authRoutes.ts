import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";

const router = Router();

// POST /auth/register → registrar usuario
router.post("/register", registerUser);

// POST /auth/login → iniciar sesión
router.post("/login", loginUser);

// POST /auth/logout → cerrar sesión
router.post("/logout", (req, res) => {
  // Si usas JWT en cookies:
  res.clearCookie("token"); // borra la cookie del token
  res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
});

export default router;