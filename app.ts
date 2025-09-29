// app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config(); // 👈 cargar variables de entorno primero
import db_connection from "./database/db_connection";

// Importar rutas (cuando estén listas se descomentan)
// import authRoutes from "./routes/authRoutes";
// import userRoutes from "./routes/userRoutes";
// import postRoutes from "./routes/postRoutes"; // Para más adelante

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para parsear JSON
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

/* ───── RUTAS TEMPORALES (DUMMY) ───── */
const dummyAuthController = {
  registerUser: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador registerUser" }),
  loginUser: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador loginUser" }),
};

const dummyUserController = {
  getAllUsers: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador getAllUsers" }),
  getUserById: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador getUserById" }),
  updateUserRole: (_req: any, res: any) =>
    res.json({ message: "TODO: implementar controlador updateUserRole" }),
};

// Rutas usando controladores dummy
app.use(
  "/auth",
  express.Router()
    .post("/register", dummyAuthController.registerUser)
    .post("/login", dummyAuthController.loginUser)
);

app.use(
  "/users",
  express.Router()
    .get("/", dummyUserController.getAllUsers)
    .get("/:id", dummyUserController.getUserById)
    .patch("/:id/role", dummyUserController.updateUserRole)
);

/* ───── FIN RUTAS TEMPORALES ───── */

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅​ Server running on http://localhost:${PORT}`);
});