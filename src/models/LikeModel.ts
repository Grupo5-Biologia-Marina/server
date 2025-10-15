import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db_connection";

export class LikeModel extends Model {
  declare userId: number;
  declare postId: number;
}

LikeModel.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      primaryKey: true, 
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "posts", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      primaryKey: true, 
    },
  },
  {
    sequelize,
    modelName: "Like",
    tableName: "likes",
    timestamps: false,
  }
);

export default LikeModel;
