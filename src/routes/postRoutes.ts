import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/PostController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

// GET /posts → lista todos los posts solo si estás logueado (user o admin)
router.get("/", authenticate, checkRole(["user", "admin"]), getPosts);

// POST /posts → crea un post (solo admin o user autenticado)
router.post("/", authenticate, checkRole(["user", "admin"]), createPost);

// PATCH /posts/:id → actualiza un post (admin puede todos, user solo los suyos)
router.patch("/:id", authenticate, checkRole(["user", "admin"]), updatePost);

// DELETE /posts/:id → elimina un post (admin puede todos, user solo los suyos)
router.delete("/:id", authenticate, checkRole(["user", "admin"]), deletePost);

export default router;