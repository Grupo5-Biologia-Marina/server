// app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db_connection from "./database/db_connection";
import UserModel from "./models/UserModel";

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

// ───── ENDPOINT TEMPORAL PARA TESTEAR USER MODEL ─────
// app.post("/test-user", async (_req, res) => {
//   try {
//     const user = await UserModel.create({
//       username: "testuser",
//       firstname: "Test",
//       lastname: "User",
//       email: "test@example.com",
//       password: "securepassword",
//       role: "user",
//     });

//     res.status(201).json({ success: true, data: user.toJSON() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error });
//   }
// });

/* ───── RUTAS TEMPORALES (DUMMY) ───── */
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
