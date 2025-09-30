import { Router } from "express";
import { getAllUsers, getUserById, updateUserRole } from "../controllers/UserController";

const router = Router();

// GET /users → lista todos los usuarios (solo admin)
router.get("/", getAllUsers);

// GET /users/:id → info de un usuario
router.get("/:id", getUserById);

// PATCH /users/:id/role → cambiar rol de usuario (solo admin)
router.patch("/:id/role", updateUserRole);

export default router;