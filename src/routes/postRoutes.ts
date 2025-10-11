import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost } from "../controllers/PostController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";
import UserModel from '../models/UserModel';

const router = Router();

// GET /posts → lista todos los posts (PÚBLICO - sin autenticación)
router.get("/", getPosts);

// GET /posts/:id → obtiene un post específico (PÚBLICO)
router.get("/:id", getPostById);

// POST /posts → crea un post (solo admin o user autenticado)
router.post("/", authenticate, checkRole(["user", "admin"]), createPost);

// PATCH /posts/:id → actualiza un post (admin puede todos, user solo los suyos)
router.patch("/:id", authenticate, checkRole(["user", "admin"]), updatePost);

// DELETE /posts/:id → elimina un post (admin puede todos, user solo los suyos)
router.delete("/:id", authenticate, checkRole(["user", "admin"]), deletePost);

export default router;