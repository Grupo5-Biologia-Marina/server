import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { registerValidation, loginValidation } from "../validators/authValidations";

const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  res.clearCookie("token"); 
  res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
});

export default router;