import { Router } from "express";
import fs from "fs";
import db_connection from "../database/db_connection";

const backupRouter = Router();

backupRouter.get("/backup", async (_req, res) => {
  try {
    const [tables]: any = await db_connection.query("SHOW TABLES");
    const tableNames = tables.map((row: any) => Object.values(row)[0]);
    const backup: Record<string, any> = {};
    for (const table of tableNames) {
      const [rows] = await db_connection.query(`SELECT * FROM \`${table}\``);
      backup[table] = rows;
    }
    const filePath = "./backup_railway.json";
    fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
    res.download(filePath, "backup_railway.json", (err) => {
      if (err) {
        console.error("Error enviando archivo:", err);
        res.status(500).send("Error enviando archivo de backup");
      }
    });
  } catch (err) {
    console.error("Error generando backup:", err);
    res.status(500).send("Error generando backup");
  }
});

export default backupRouter;
