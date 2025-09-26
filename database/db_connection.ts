import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const DB_NAME: string = process.env.DB_NAME!;
const USER_DB: string = process.env.USER_DB!;
const PASSWORD_DB: string = process.env.PASSWORD_DB!;
const HOST: string = process.env.HOST!;
const DB_DIALECT = (process.env.DB_DIALECT || "mysql") as "mysql";

// 👇 Debug temporal para ver qué valores llegan del .env
console.log("🔎 ENV ->", {
  DB_NAME,
  USER_DB,
  PASSWORD_DB,
  HOST,
  DB_DIALECT,
});

const DB_PORT = Number(process.env.DB_PORT) || 3306;

const db_connection = new Sequelize(DB_NAME, USER_DB, PASSWORD_DB, {
  host: HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default db_connection;
