// server/scripts/syncPostsSeeder.ts
import "dotenv/config";
import fs from "fs";
import path from "path";
import sequelize from "../../src/database/db_connection";
import PostModel, { PostAttributes, PostCreationAttributes } from "../../src/models/PostModel";
import PostImageModel from "../../src/models/PostImageModel";
import CategoryModel from "../../src/models/CategoryModel";
import UserModel from "../../src/models/UserModel";

// Añadimos los métodos que TypeScript no detecta automáticamente
declare module "../../src/models/PostModel" {
  interface PostModel {
    createImage(image: Partial<PostImageModel>): Promise<PostImageModel>;
    setCategories(ids: number[]): Promise<void>;
    images?: PostImageModel[];
    categories?: CategoryModel[];
  }
}

async function syncPostsSeeder() {
  try {
    console.log("🔄 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con éxito.");

    // Cargamos todos los posts con sus relaciones
    const posts = await PostModel.findAll({
      include: [
        { model: PostImageModel, as: "images" },
        { model: UserModel, as: "user", attributes: ["id", "username", "role"] },
        { model: CategoryModel, as: "categories", through: { attributes: [] } },
      ],
    });

    console.log(`📦 Se encontraron ${posts.length} posts.`);

    // Leemos el JSON que generamos antes
    const seedFilePath = path.resolve(__dirname, "../src/seeders/postsSeed.json");
    const postsSeed = JSON.parse(fs.readFileSync(seedFilePath, "utf-8"));

    for (const postData of postsSeed) {
      // Creamos el post si no existe
      const [dbPost] = await PostModel.findOrCreate({
        where: { id: postData.id },
        defaults: {
          userId: postData.userId,
          title: postData.title,
          content: postData.content,
          credits: postData.credits,
          createdAt: new Date(postData.createdAt),
          updatedAt: new Date(postData.updatedAt),
        },
      });

      // Guardamos imágenes
      if (postData.images?.length) {
        for (const img of postData.images) {
          await dbPost.createImage({
            url: img.url,
            caption: img.caption,
            credit: img.credit,
            createdAt: img.createdAt ? new Date(img.createdAt) : undefined,
            updatedAt: img.updatedAt ? new Date(img.updatedAt) : undefined,
          });
        }
      }

      // Guardamos categorías
      if (postData.categories?.length) {
        const categoryIds = postData.categories.map((cat: any) => cat.id);
        await dbPost.setCategories(categoryIds); // mantiene existentes y añade nuevas
      }
    }

    console.log("✨ Posts sincronizados correctamente en la DB local.");

    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error sincronizando los posts:", error);
    await sequelize.close();
  }
}

// Ejecutamos
syncPostsSeeder();
