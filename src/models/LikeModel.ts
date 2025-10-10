import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db_connection";

export class LikeModel extends Model {
  declare id: number;
  declare userId: number;
  declare postId: number;
}

LikeModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "posts", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"], // evita likes duplicados
      },
    ],
  }
);

export default LikeModel;
