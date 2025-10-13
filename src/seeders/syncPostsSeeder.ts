import "dotenv/config";
import fs from "fs";
import path from "path";
import sequelize from "../../src/database/db_connection";
import PostModel from "../../src/models/PostModel";
import PostImageModel from "../../src/models/PostImageModel";
import CategoryModel from "../../src/models/CategoryModel";

async function syncPostsSeeder() {
  try {
    console.log("🔄 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con éxito.");

    // Ruta al JSON generado con syncPosts.ts
    const jsonPath = path.resolve(__dirname, "../src/seeders/postsSeed.json");

    if (!fs.existsSync(jsonPath)) {
      console.error("❌ No se encontró el archivo postsSeed.json. Ejecuta primero syncPosts.ts");
      process.exit(1);
    }

    const postsData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`📦 Importando ${postsData.length} posts...`);

    for (const post of postsData) {
      // Buscamos si el post ya existe
      const [dbPost] = await PostModel.upsert({
        id: post.id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        credits: post.credits,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      });

      // Guardar imágenes si hay
      if (post.images?.length) {
        for (const img of post.images) {
          await PostImageModel.upsert({
            id: img.id,
            postId: dbPost.id,
            url: img.url,
            caption: img.caption,
            credit: img.credit,
            createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
            updatedAt: img.updatedAt ? new Date(img.updatedAt) : new Date(),
          });
        }
      }

      // Vincular categorías si existen
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

        // Forzamos el tipo para que TS no se queje
        await (dbPost as any).setCategories(categoryIds);
      }

      console.log(`✅ Post sincronizado: ${post.title}`);
    }

    console.log("🎉 ¡Sincronización completada sin errores!");
    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error sincronizando los posts:", error);
    await sequelize.close();
  }
}

syncPostsSeeder();
