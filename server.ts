// server.ts
import { app } from "./src/app";

const PORT = Number(process.env.APP_PORT) || 4000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});