import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import db_connection from "./database/db_connection";

dotenv.config();

const app = express();


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
export { app };