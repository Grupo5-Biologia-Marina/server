import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL!, {
  dialect: "mysql",
  define: {
    timestamps: true,
    underscored: false,
  },
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("✅ Conectado a Railway MySQL"))
  .catch(err => console.error("❌ Error de conexión:", err));

export default sequelize;
