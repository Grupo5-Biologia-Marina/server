// src/routes/likeRoutes.ts
import { Router } from "express";
import { getLikeInfo, toggleLike } from "../controllers/LikeController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/:id/likes", authenticate, getLikeInfo);
router.post("/:id/likes", authenticate, checkRole(["user", "admin"]), toggleLike);

export default router;