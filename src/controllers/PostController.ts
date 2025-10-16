import { Request, Response } from 'express';
import PostModel from '../models/PostModel';
import { AuthenticatedRequest } from '../types/auth';
import { PostCreateInput, PostOutput, ApiResponse } from '../types/posts';
import cloudinary from '../utils/cloudinary';
import db_connection from '../database/db_connection';
import CategoryModel from '../models/CategoryModel';
import PostImageModel from '../models/PostImageModel';
import UserModel from '../models/UserModel';
import LikeModel from '../models/LikeModel';


export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // ✅ Validar admin
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const postData: PostCreateInput = req.body;

    // ✅ Extraer las propiedades de postData
    const { userId, title, content, credits, categories, images } = postData;

    // 1️⃣ Crear post principal
    const post = await PostModel.create({ userId, title, content, credits });
    const postId = post.id;

    // 2️⃣ Asociar categorías usando Sequelize (buscar por nombre)
    if (Array.isArray(categories) && categories.length > 0) {
      const categoryInstances = await CategoryModel.findAll({
        where: {
          name: categories
        }
      });

      if (categoryInstances.length > 0) {
        // @ts-ignore - Sequelize adds this method automatically
        await post.setCategories(categoryInstances);
      }
    }

    // 3️⃣ Guardar imágenes (tabla post_images)
    if (Array.isArray(images) && images.length > 0) {
      for (const imageUrl of images) {
        await PostImageModel.create({ postId, url: imageUrl });
      }
    }

    // 4️⃣ Obtener el post completo con relaciones
    const fullPost = await PostModel.findByPk(postId, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username']
        },
        {
          model: CategoryModel,
          as: 'categories',
          through: { attributes: [] }
        },
        {
          model: PostImageModel,
          as: 'images'
        }
      ]
    });

    // ✅ Respuesta
    const response: ApiResponse<any> = {
      success: true,
      data: fullPost?.toJSON(),
      message: 'Post created successfully',
    };
    res.status(201).json(response);

  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationErrors.join(', '),
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message,
    });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    // 🔍 Obtener posts con categorías, imágenes y usuario
    const posts = await PostModel.findAll({
      include: [
        {
          model: CategoryModel,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name', 'description']
        },
        {
          model: PostImageModel,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'credit']
        },
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const response: ApiResponse<any[]> = {
      success: true,
      data: posts.map(p => p.toJSON()),
      message: 'Posts fetched successfully',
    };
    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: error.message,
    });
  }
};


export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // 🔍 Obtener post con todas sus relaciones incluyendo conteo de likes
    const post = await PostModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          model: CategoryModel,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name', 'description']
        },
        {
          model: PostImageModel,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'credit']
        },
        {
          model: LikeModel,
          as: 'likes',
          attributes: [] // ❤️ Solo contar
        }
      ],
      attributes: {
        include: [
          // ❤️ Añadir el conteo de likes
          [
            db_connection.fn('COUNT', db_connection.fn('DISTINCT', db_connection.col('likes.userId'))),
            'likesCount'
          ]
        ]
      },
      group: ['Post.id', 'user.id', 'categories.id', 'images.id'],
      subQuery: false
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    const response: ApiResponse<any> = {
      success: true,
      data: post.toJSON(),
      message: 'Post fetched successfully',
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post',
      error: error.message,
    });
  }
};

// GET ver posts por UserId
export const getPostsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "Falta el ID del usuario" });
      return;
    }

    const posts = await PostModel.findAll({
      where: { userId },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error al obtener las publicaciones del usuario:", error);
    res.status(500).json({ message: "Error al obtener las publicaciones del usuario" });
  }
};


export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const post = await PostModel.findByPk(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Admin puede borrar cualquier post, user solo el suyo
    if (req.user.role !== 'admin' && post.userId !== Number(req.user.id)) {
      res.status(403).json({ success: false, message: 'Forbidden: no puedes borrar este post' });
      return;
    }

    await post.destroy();

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Post deleted successfully',
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: error.message,
    });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const post = await PostModel.findByPk(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Admin puede actualizar cualquier post, user solo el suyo
    if (req.user.role !== 'admin' && post.userId !== +req.user.id) {
      res.status(403).json({ success: false, message: 'Forbidden: no puedes actualizar este post' });
      return;
    }

    const postData: Partial<PostCreateInput> = req.body;
    const { title, content, credits, categories, images } = postData;

    console.log('📦 Datos recibidos para actualizar:', { title, content, credits, categories, images });

    // 1️⃣ Actualizar datos básicos del post (solo si se envían)
    const updateFields: any = {};
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (credits !== undefined) updateFields.credits = credits;

    if (Object.keys(updateFields).length > 0) {
      await post.update(updateFields);
    }

    // 2️⃣ Actualizar categorías (siempre si se envían)
    if (categories !== undefined && Array.isArray(categories)) {
      console.log('📂 Actualizando categorías:', categories);

      if (categories.length > 0) {
        const categoryInstances = await CategoryModel.findAll({
          where: {
            name: categories
          }
        });

        console.log('📂 Categorías encontradas:', categoryInstances.length);

        // @ts-ignore - Sequelize adds this method automatically
        await post.setCategories(categoryInstances);
      } else {
        // Si se envía array vacío, eliminar todas las categorías
        // @ts-ignore
        await post.setCategories([]);
      }
    }

    // 3️⃣ Actualizar imágenes (siempre si se envían)
    if (images !== undefined && Array.isArray(images)) {
      console.log('🖼️ Actualizando imágenes. Total:', images.length);

      // Eliminar TODAS las imágenes antiguas primero
      const deletedCount = await PostImageModel.destroy({
        where: { postId: Number(id) }
      });

      console.log('🗑️ Imágenes eliminadas:', deletedCount);

      // Crear las nuevas imágenes (si hay)
      if (images.length > 0) {
        for (const imageUrl of images) {
          await PostImageModel.create({
            postId: Number(id),
            url: imageUrl
          });
        }
        console.log('✅ Nuevas imágenes creadas:', images.length);
      }
    }

    // 4️⃣ Obtener el post actualizado con todas sus relaciones
    const updatedPost = await PostModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'username', 'email']
        },
        {
          model: CategoryModel,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name', 'description']
        },
        {
          model: PostImageModel,
          as: 'images',
          attributes: ['id', 'url', 'caption', 'credit']
        }
      ]
    });

    const response: ApiResponse<any> = {
      success: true,
      data: updatedPost?.toJSON(),
      message: 'Post updated successfully',
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error updating post:', error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationErrors.join(', '),
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating post',
      error: error.message,
    });
  }
};