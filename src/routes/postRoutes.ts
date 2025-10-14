import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, getPostsByUserId  } from "../controllers/PostController";
import { toggleLike, getLikeInfo } from "../controllers/LikeController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

// GET /posts → lista todos los posts (PÚBLICO)
router.get("/", getPosts);

// GET /posts/:id → obtiene un post específico (PÚBLICO)
router.get("/:id", getPostById);

//GET /my-posts/  -> obtiene posts por UserId
router.get(
  "/user/:userId",
  authenticate,
  checkRole(["user", "admin"]),
  getPostsByUserId
);

// POST /posts → crea un post (solo admin o user autenticado)
router.post("/", authenticate, checkRole(["user", "admin"]), createPost);

// PATCH /posts/:id → actualiza un post
router.patch("/:id", authenticate, checkRole(["user", "admin"]), updatePost);

// DELETE /posts/:id → elimina un post
router.delete("/:id", authenticate, checkRole(["user", "admin"]), deletePost);

// ❤️ LIKES (solo usuarios autenticados)
router.post("/:id/like", authenticate, toggleLike); // Toggle like/unlike
router.get("/:id/likes", getLikeInfo); // Obtener info de likes (público pero con info de user si está logado)

export default router;