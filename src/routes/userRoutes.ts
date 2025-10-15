import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/UserController";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

// GET /users → lista todos los usuarios (solo admin)
router.get("/", checkRole(["admin"]), getUsers);

// GET /users/:id → info de un usuario
router.get("/:id", getUserById);

// PATCH /users/:id → actualizar usuario (perfil, imagen, etc.)
router.patch("/:id", updateUser);

// PATCH /users/:id/role → cambiar rol de usuario (solo admin)
router.patch("/:id/role", checkRole(["admin"]), updateUser);

export default router;