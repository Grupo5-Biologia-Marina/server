import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db_connection";
import UserModel from "../models/UserModel";

export interface DiscoverAttributes {
  id: number;
  userId: Buffer;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DiscoverCreationAttributes
  extends Optional<DiscoverAttributes, "id" | "createdAt" | "updatedAt"> {}

export class DiscoverModel extends Model<DiscoverAttributes, DiscoverCreationAttributes>
  implements DiscoverAttributes {
  declare id: number;
  declare userId: Buffer;
  declare content: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

DiscoverModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BLOB("tiny"),
      allowNull: false,
      references: {
        model: UserModel,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Discover",
    tableName: "posts",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

UserModel.hasMany(DiscoverModel, { foreignKey: "userId", as: "posts" });
DiscoverModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

export default DiscoverModel;