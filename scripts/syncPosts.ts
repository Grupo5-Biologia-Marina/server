import "dotenv/config";
import fs from "fs";
import path from "path";
import sequelize from "../src/database/db_connection";
import PostModel from "../src/models/PostModel";
import PostImageModel from "../src/models/PostImageModel";
import CategoryModel from "../src/models/CategoryModel";
import UserModel from "../src/models/UserModel";

async function syncPosts() {
  try {
    console.log("🔄 Conectando a la base de datos...");
    await sequelize.authenticate();
    console.log("✅ Conexión establecida con éxito.");

    const posts = await PostModel.findAll({
      include: [
        { model: PostImageModel, as: "images" },
        { model: CategoryModel, as: "categories", through: { attributes: [] } },
        { model: UserModel, as: "user", attributes: ["id", "username", "role"] },
      ],
    });

    console.log(`📦 Se encontraron ${posts.length} posts.`);

    const postsSeed = posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      user: post.user
        ? {
            id: post.user.id,
            username: post.user.username,
            role: post.user.role,
          }
        : null,
      title: post.title,
      content: post.content,
      credits: post.credits,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      images: post.images?.map((img: any) => ({
        id: img.id,
        postId: img.postId,
        url: img.url,
        caption: img.caption,
        credit: img.credit,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      })) || [],
      categories: post.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        img: cat.img,
      })) || [],
    }));

    // Ruta corregida: dentro de src/seeders
    const seedFilePath = path.resolve(__dirname, "../src/seeders/postsSeed.json");
    
    const seedDir = path.dirname(seedFilePath);
    if (!fs.existsSync(seedDir)) {
      fs.mkdirSync(seedDir, { recursive: true });
    }

    fs.writeFileSync(seedFilePath, JSON.stringify(postsSeed, null, 2));
    console.log(`✅ Archivo JSON exportado en: ${seedFilePath}`);
    console.log("📤 Ahora puedes compartir este archivo con tu equipo via Git.");

    await sequelize.close();
    console.log("🔒 Conexión cerrada.");
  } catch (error) {
    console.error("❌ Error:", error);
    await sequelize.close();
    process.exit(1);
  }
}

syncPosts();