import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/UserController";
import { checkRole } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", checkRole(["admin"]), getUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.patch("/:id/role", checkRole(["admin"]), updateUser);

export default router;