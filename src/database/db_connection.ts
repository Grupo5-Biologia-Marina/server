import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isRailway = !!process.env.MYSQL_PUBLIC_URL;

const sequelize = isRailway
  ? new Sequelize(process.env.MYSQL_PUBLIC_URL!, {
      dialect: "mysql",
      define: { timestamps: true, underscored: false },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME!, 
      process.env.USER_DB!, 
      process.env.PASSWORD_DB!, 
      {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        define: { timestamps: true, underscored: false },
        logging: false,
      }
    );

sequelize.authenticate()
  .then(() => console.log(`✅ Conectado a ${isRailway ? "Railway" : "local MySQL"}`))
  .catch(err => console.error("❌ Error de conexión:", err));

export default sequelize;