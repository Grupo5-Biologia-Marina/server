import dotenv from 'dotenv';
dotenv.config();

console.log('Todas las variables cargadas:', Object.keys(process.env).filter(k => k.startsWith('EMAIL') || k.startsWith('FRONTEND')));

import { app } from "./src/app";

const APP_PORT = Number(process.env.APP_PORT) || 4000;

app.listen(APP_PORT, () => {
  console.log(`✅ Server running on http://localhost:${APP_PORT}`);
});