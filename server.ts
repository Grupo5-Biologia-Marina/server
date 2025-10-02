import { app } from "./src/app";

const APP_PORT = Number(process.env.APP_PORT) || 4000;

app.listen(APP_PORT, () => {
  console.log(`✅ Server running on http://localhost:${APP_PORT}`);
});