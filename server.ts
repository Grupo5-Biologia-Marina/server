import dotenv from 'dotenv';
dotenv.config();

console.log('Todas las variables cargadas:', Object.keys(process.env).filter(k => k.startsWith('EMAIL') || k.startsWith('FRONTEND')));

import { app } from "./src/app";
import db_connection from "./src/database/db_connection";

const APP_PORT = Number(process.env.APP_PORT) || 4000;

// 🔄 Sincronizar base de datos antes de iniciar el servidor
const startServer = async () => {
  try {
    // Sincronizar modelos con la base de datos (sin borrar datos)
    await db_connection.sync({ alter: true });
    console.log('✅ Base de datos sincronizada');

    app.listen(APP_PORT, () => {
      console.log(`✅ Server running on http://localhost:${APP_PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();