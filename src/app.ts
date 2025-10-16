import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db_connection from "./database/db_connection";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";          
import postImagesRouter from "./routes/postImages";  
import likeRoutes from "./routes/likeRoutes";  

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());


app.get("/health", async (_req, res) => {
  try {
    await db_connection.authenticate();
    res.json({ status: "ok", message: "DB connected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});


app.use("/auth", authRoutes);   
app.use("/users", userRoutes);  
app.use("/api/posts", postRoutes);         
app.use("/api/posts", postImagesRouter);
app.use("/api/posts", likeRoutes);

export { app };