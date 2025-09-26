import { Router } from "express";
import { getPosts, createPost } from "../controllers/postController";

const router = Router();

// GET /posts → lista todos los posts
router.get("/", getPosts);

// POST /posts → crea un post (solo admin o user autenticado)
router.post("/", createPost);

export default router;