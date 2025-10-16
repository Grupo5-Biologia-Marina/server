import { DataTypes, Model } from "sequelize";
import sequelize from "../../src/database/db_connection";
import LikeModel from "./LikeModel"; 

export class UserModel extends Model {
  declare id: number;
  declare username: string;
  declare firstname?: string;
  declare lastname?: string;
  declare email: string;
  declare password: string;
  declare role: "user" | "admin";
  declare img?: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    img: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

UserModel.hasMany(LikeModel, {
  foreignKey: "userId",
  as: "likes",
  onDelete: "CASCADE",
});

export default UserModel;