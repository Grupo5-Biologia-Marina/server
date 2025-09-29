// app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db_connection from "./database/db_connection";

const app = express();
app.use(express.json());

/* ───── ENDPOINT DE PRUEBA ───── */
app.get("/health", async (_req, res) => {
  try {
    await db_connection.authenticate();
    res.json({ status: "ok", message: "DB connected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "DB connection failed" });
  }
});

/* ───── DUMMY ROUTES ───── */
const dummyAuthController = {
  registerUser: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador registerUser" }),
  loginUser: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador loginUser" }),
};

app.use(
  "/auth",
  express.Router()
    .post("/register", dummyAuthController.registerUser)
    .post("/login", dummyAuthController.loginUser)
);

export { app }; // ✅ exportamos la app
