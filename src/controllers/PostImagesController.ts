import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import PostImageModel from "../models/PostImageModel";

export const uploadPostImage = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { caption, credit } = req.body;

    // Tipar req.file aquí
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `posts/${postId}`,
    });

    // Guardar en la base de datos
    const image = await PostImageModel.create({
      postId: Number(postId),
      url: result.secure_url,
      caption,
      credit,
    });

    res.status(201).json({ success: true, data: image });
  } catch (err: any) {
    console.error("Error uploading image:", err);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
};
