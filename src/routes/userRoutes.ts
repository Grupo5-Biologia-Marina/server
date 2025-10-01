import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/UserController";

const router = Router();

// GET /users → lista todos los usuarios (solo admin)
router.get("/", getUsers);

// GET /users/:id → info de un usuario
router.get("/:id", getUserById);

// PATCH /users/:id/role → cambiar rol de usuario (solo admin)
router.patch("/:id/role", updateUser);

export default router;