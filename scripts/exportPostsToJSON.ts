import fs from "fs";
import path from "path";
import sequelize from "../src/database/db_connection";
import PostModel from "../src/models/PostModel";
import PostImageModel from "../src/models/PostImageModel";
import UserModel from "../src/models/UserModel";
import CategoryModel from "../src/models/CategoryModel";

(async () => {
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

    // 🔧 Convertimos los datos a formato JSON limpio
    const data = posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      user: post.user ? {
        id: post.user.id,
        username: post.user.username,
        role: post.user.role,
      } : null,
      title: post.title,
      content: post.content,
      credits: post.credits,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      categories: post.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
      })),
      images: post.images?.map((img: any) => ({
        url: img.url,
        caption: img.caption,
        credit: img.credit,
      })),
    }));

    // 📁 Guardamos el JSON resultante
    const outputPath = path.resolve(__dirname, "../src/seeders/postsSeed.json");
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    console.log(`✅ Archivo JSON exportado correctamente en: ${outputPath}`);
    console.log("✨ Puedes usarlo ahora en tu seeder para compartir los posts.");

    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error exportando los posts:", error);
    await sequelize.close();
  }
})();
