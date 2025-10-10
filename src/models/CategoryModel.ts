import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db_connection";

export class CategoryModel extends Model {
  declare id: number;
  declare name: string;
  declare description?: string;
  declare img?: string;
}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING(500), // URL de Cloudinary
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

export default CategoryModel;