// src/routes/likeRoutes.ts
import { Router } from "express";
import { getLikeInfo, toggleLike } from "../controllers/LikeController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

// 📊 GET /posts/:id/likes → obtener información de likes de un post
router.get("/:id/likes", authenticate, getLikeInfo);

// ❤️ POST /posts/:id/likes → dar o quitar like
router.post("/:id/likes", authenticate, checkRole(["user", "admin"]), toggleLike);

export default router;
