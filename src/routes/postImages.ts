import express from "express";
import multer from "multer";
import { uploadPostImage } from "../controllers/PostImagesController";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/:postId/images", upload.single("image"), uploadPostImage);

export default router;
