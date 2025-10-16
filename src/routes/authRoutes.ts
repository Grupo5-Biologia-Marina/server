import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidation, loginValidation } from "../validators/authValidations";

const router = Router();

<<<<<<< HEAD
// Registro
router.post("/register", registerValidation, validationMiddleware, registerUser);

// Login
router.post("/login", loginValidation, validationMiddleware, loginUser);

// POST /auth/logout → cerrar sesión
=======

router.post("/register", registerUser);
router.post("/login", loginUser);
>>>>>>> fe6a680355f22f7da349a9f8fa702956e655c633
router.post("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
});

export default router;