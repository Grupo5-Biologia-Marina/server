import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database/db_connection";
import PostModel from "./PostModel";

export interface PostImageAttributes {
  id: number;
  postId: number;   // FK to Post
  url: string;      // Cloudinary URL
  caption?: string; // optional
  credit?: string;  // optional
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PostImageCreationAttributes
  extends Optional<PostImageAttributes, "id" | "caption" | "credit" | "createdAt" | "updatedAt"> {}

export class PostImageModel extends Model<PostImageAttributes, PostImageCreationAttributes>
  implements PostImageAttributes {
  declare id: number;
  declare postId: number;
  declare url: string;
  declare caption?: string;
  declare credit?: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

PostImageModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: PostModel, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      field: 'postId',
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    caption: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    credit: {
      type: DataTypes.STRING(500),
      allowNull: true,
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
    modelName: "PostImage",
    tableName: "post_images",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

PostModel.hasMany(PostImageModel, { foreignKey: "postId", as: "images" });
PostImageModel.belongsTo(PostModel, { foreignKey: "postId", as: "post" });

export default PostImageModel;