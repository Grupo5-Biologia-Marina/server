'use strict';

import { QueryInterface, Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

interface PostJSON {
  id: number;
  userId: number;
  title: string;
  content: string;
  credits?: string;
  createdAt: string;
  updatedAt: string;
  images?: {
    id: number;
    postId: number;
    url: string;
    caption?: string;
    credit?: string;
    createdAt: string;
    updatedAt: string;
  }[];
  categories?: {
    id: number;
    name: string;
    description?: string;
    img?: string;
  }[];
}

module.exports = {
  async up(queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
    // 1️⃣ Leer el JSON
    const filePath = path.resolve(__dirname, './postsSeed.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const posts: PostJSON[] = JSON.parse(rawData);

    // 2️⃣ Insertar posts
    await queryInterface.bulkInsert(
      'posts',
      posts.map((p) => ({
        id: p.id,
        userId: p.userId,
        title: p.title,
        content: p.content,
        credits: p.credits || null,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }))
    );

    // 3️⃣ Insertar imágenes de cada post
    const allImages = posts.flatMap((p) =>
      (p.images || []).map((img) => ({
        id: img.id,
        postId: img.postId,
        url: img.url,
        caption: img.caption || null,
        credit: img.credit || null,
        createdAt: new Date(img.createdAt),
        updatedAt: new Date(img.updatedAt),
      }))
    );

    if (allImages.length > 0) {
      await queryInterface.bulkInsert('post_images', allImages);
    }

    // 4️⃣ Insertar relaciones post_categories
    const postCategories = posts.flatMap((p) =>
      (p.categories || []).map((c) => ({
        postId: p.id,
        categoryId: c.id,
      }))
    );

    if (postCategories.length > 0) {
      await queryInterface.bulkInsert('post_categories', postCategories);
    }
  },

  async down(queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
    // Borra todo lo que insertamos
    const filePath = path.resolve(__dirname, './postsSeed.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const posts: PostJSON[] = JSON.parse(rawData);

    const postIds = posts.map((p) => p.id);

    await queryInterface.bulkDelete('post_categories', { postId: postIds });
    await queryInterface.bulkDelete('post_images', { postId: postIds });
    await queryInterface.bulkDelete('posts', { id: postIds });
  },
};
