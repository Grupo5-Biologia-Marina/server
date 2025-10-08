import { Router } from "express";
import { getPosts, createPost } from "../controllers/PostController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

// GET /posts → lista todos los posts
router.get("/", getPosts);

// POST /posts → crea un post (solo admin o user autenticado)
router.post("/", authenticate, createPost);

export default router;