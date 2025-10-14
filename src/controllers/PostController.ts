import { Request, Response } from 'express';
import PostModel from '../models/PostModel';
import { AuthenticatedRequest } from '../types/auth';
import { PostCreateInput, PostOutput, ApiResponse } from '../types/posts';
import cloudinary from '../utils/cloudinary';
import db_connection from '../database/db_connection';
import CategoryModel from '../models/CategoryModel';
import PostImageModel from '../models/PostImageModel';
import UserModel from '../models/UserModel';


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
    // 🔍 Obtener posts con categorías e imágenes usando Sequelize
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
        }
      ]
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
        }
      ]
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

    const updateData: Partial<PostCreateInput> = req.body;
    await post.update(updateData);

    const response: ApiResponse<PostOutput> = {
      success: true,
      data: post.toJSON() as PostOutput,
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
