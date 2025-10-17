import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, getPostsByUserId } from "../controllers/PostController";
import { authenticate } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.get(
  "/user/:userId",
  authenticate,
  checkRole(["user", "admin"]),
  getPostsByUserId
);
router.post("/", authenticate, checkRole(["user", "admin"]), createPost);
router.patch("/:id", authenticate, checkRole(["user", "admin"]), updatePost);
router.delete("/:id", authenticate, checkRole(["user", "admin"]), deletePost);

export default router;