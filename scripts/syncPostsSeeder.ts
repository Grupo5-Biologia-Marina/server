import "dotenv/config";
import fs from "fs";
import path from "path";
import sequelize from "../src/database/db_connection";
import PostModel from "../src/models/PostModel";
import PostImageModel from "../src/models/PostImageModel";
import CategoryModel from "../src/models/CategoryModel";

async function syncPostsSeeder() {
  try {
    console.log("Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("Conexion establecida con exito.");

    const jsonPath = path.resolve(__dirname, "../src/seeders/postsSeed.json");

    if (!fs.existsSync(jsonPath)) {
      console.error("No se encontro postsSeed.json");
      console.error(`Buscando en: ${jsonPath}`);
      console.error("\nAsegurate de:");
      console.error("   1. Haber ejecutado 'npx ts-node scripts/syncPosts.ts' primero");
      console.error("   2. Tener el archivo postsSeed.json en src/seeders/");
      process.exit(1);
    }

    const postsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`Importando ${postsData.length} posts...\n`);

    for (const post of postsData) {
      const [dbPost, created] = await PostModel.upsert({
        id: post.id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        credits: post.credits,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      });

      console.log(`${created ? 'Creado' : 'Actualizado'}: ${post.title}`);

      if (post.images?.length) {
        for (const img of post.images) {
          await PostImageModel.upsert({
            id: img.id,
            postId: dbPost.id,
            url: img.url,
            caption: img.caption || null,
            credit: img.credit || null,
            createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
            updatedAt: img.updatedAt ? new Date(img.updatedAt) : new Date(),
          });
        }
        console.log(`  ${post.images.length} imagenes sincronizadas`);
      }

      if (post.categories?.length) {
        const categoryIds: number[] = [];

        for (const cat of post.categories) {
          const [category] = await CategoryModel.findOrCreate({
            where: { id: cat.id },
            defaults: {
              name: cat.name,
              description: cat.description || null,
              img: cat.img || null,
            },
          });
          categoryIds.push(category.id);
        }

        await (dbPost as any).setCategories(categoryIds);
        console.log(`  ${categoryIds.length} categorias vinculadas`);
      }
    }

    console.log("\nSincronizacion completada sin errores!");
    await sequelize.close();
    console.log("Conexion cerrada.");
  } catch (error) {
    console.error("Error:", error);
    await sequelize.close();
    process.exit(1);
  }
}

syncPostsSeeder();