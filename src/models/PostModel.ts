import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db_connection";
import UserModel from "./UserModel";
import CategoryModel from "./CategoryModel";
import LikeModel from "./LikeModel";

export interface PostAttributes {
  id: number;
  userId: number;
  title: string;
  content: string;
  credits?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "createdAt" | "updatedAt"> {}

export class PostModel extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare content: string;
  declare credits?: string;
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
      field: "userId",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    credits: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updatedAt",
    },
  },
  {
    sequelize,
    modelName: "Post",
    tableName: "posts",
    timestamps: true,
  }
);

UserModel.hasMany(PostModel, { foreignKey: "userId", as: "posts" });
PostModel.belongsTo(UserModel, { foreignKey: "userId", as: "user" });

PostModel.belongsToMany(CategoryModel, {
  through: "post_categories",
  foreignKey: "postId",
  otherKey: "categoryId",
  as: "categories",
  timestamps: false,
});

CategoryModel.belongsToMany(PostModel, {
  through: "post_categories",
  foreignKey: "categoryId",
  otherKey: "postId",
  as: "posts",
  timestamps: false,
});

PostModel.hasMany(LikeModel, {
  foreignKey: "postId",
  as: "likes",
  onDelete: "CASCADE",
});

LikeModel.belongsTo(PostModel, {
  foreignKey: "postId",
  as: "post",
});

export default PostModel;