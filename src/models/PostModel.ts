import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db_connection";
import UserModel from "./UserModel";
import CategoryModel from "./CategoryModel";

export interface PostAttributes {
  id: number;
  userId: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "createdAt" | "updatedAt"> {}

export class PostModel extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  declare id: number;
  declare userId: number;
  declare content: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

PostModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

UserModel.hasMany(PostModel, { foreignKey: "userId", as: "posts" });
PostModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

PostModel.belongsToMany(CategoryModel, {
  through: "post_categories",
  foreignKey: "postId",
  otherKey: "categoryId",
  as: "categories",
});

CategoryModel.belongsToMany(PostModel, {
  through: "post_categories",
  foreignKey: "categoryId",
  otherKey: "postId",
  as: "posts",
});

export default PostModel;