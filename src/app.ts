import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";          
import postImagesRouter from "./routes/postImages";  
import likeRoutes from "./routes/likeRoutes";  
import backupRouter from "./routes/backupRouter";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use("/", backupRouter);
app.use("/auth", authRoutes);   
app.use("/users", userRoutes);  
app.use("/api/posts", postRoutes);         
app.use("/api/posts", postImagesRouter);
app.use("/api/posts", likeRoutes);

export { app };