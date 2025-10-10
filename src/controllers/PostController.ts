import { Request, Response } from 'express';
import PostModel from '../models/PostModel';
import { AuthenticatedRequest } from '../types/auth';
import { PostCreateInput, PostOutput, ApiResponse } from '../types/posts';
import db_connection from '../database/db_connection';
import CategoryModel from '../models/CategoryModel';
import PostImageModel from '../models/PostImageModel';

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    if (req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can create posts' });
      return;
    }

    const { title, content, credits, userId, categories, images }: PostCreateInput = req.body;

    const post = await PostModel.create({ userId, title, content, credits });
    const postId = post.id;

    // Asociar categorías
    if (Array.isArray(categories) && categories.length > 0) {
      for (const categoryId of categories) {
        const category = await CategoryModel.findByPk(categoryId);
        if (category) {
          await db_connection.query(
            'INSERT INTO post_categorias (post_id, category_id) VALUES (?, ?)',
            { replacements: [postId, categoryId] }
          );
        }
      }
    }

    // Guardar imágenes
    if (Array.isArray(images) && images.length > 0) {
      for (const imageUrl of images) {
        await PostImageModel.create({ postId, url: imageUrl });
      }
    }

    const response: ApiResponse<PostOutput> = {
      success: true,
      data: post.toJSON() as PostOutput,
      message: 'Post created successfully',
    };
    res.status(201).json(response);

  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message,
    });
  }
};

// GET posts con imágenes y categorías
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await PostModel.findAll({
      include: [
        { model: PostImageModel, as: 'images', attributes: ['url'] },
        { model: CategoryModel, as: 'categories', attributes: ['name'], through: { attributes: [] } },
      ],
      order: [['createdAt', 'DESC']],
    });

    const data: PostOutput[] = posts.map(post => {
      const postJson = post.toJSON() as any; // aquí decimos que puede tener las relaciones
      return {
        id: postJson.id,
        userId: postJson.userId,
        title: postJson.title,
        content: postJson.content,
        credits: postJson.credits,
        createdAt: postJson.createdAt,
        updatedAt: postJson.updatedAt,
        images: (postJson.images || []).map((img: any) => img.url),
        categories: (postJson.categories || []).map((cat: any) => cat.name),
      };
    });

    res.status(200).json({
      success: true,
      data,
      message: 'Posts fetched successfully',
    });

  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching posts',
      error: error.message,
    });
  }
};


// GET post por ID con imágenes y categorías
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await PostModel.findByPk(id, {
      include: [
        { model: PostImageModel, as: 'images', attributes: ['url'] },
        { model: CategoryModel, as: 'categories', attributes: ['name'], through: { attributes: [] } },
      ],
    });

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const postJson = post.toJSON() as any;
    const data: PostOutput = {
      id: postJson.id,
      userId: postJson.userId,
      title: postJson.title,
      content: postJson.content,
      credits: postJson.credits,
      createdAt: postJson.createdAt,
      updatedAt: postJson.updatedAt,
      images: (postJson.images || []).map((img: any) => img.url),
      categories: (postJson.categories || []).map((cat: any) => cat.name),
    };

    res.status(200).json({
      success: true,
      data,
      message: 'Post fetched successfully',
    });

  } catch (error: any) {
    console.error('Error fetching post:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching post', error: error.message });
  }
};


export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can delete posts' });
      return;
    }

    const post = await PostModel.findByPk(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
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

    if (req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden: Only admin can update posts' });
      return;
    }

    const post = await PostModel.findByPk(id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
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
