import { Request, Response } from 'express';
import PostModel from '../models/PostModel';
import { AuthenticatedRequest } from '../types/auth';
import { PostCreateInput, PostOutput, ApiResponse } from '../types/posts';

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

    const postData: PostCreateInput = req.body;

    const post = await PostModel.create({
      userId: postData.userId,
      content: postData.content,
    });

    const response: ApiResponse<PostOutput> = {
      success: true,
      data: post.toJSON() as PostOutput,
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
    const posts = await PostModel.findAll();
    const response: ApiResponse<PostOutput[]> = {
      success: true,
      data: posts.map((p) => p.toJSON() as PostOutput),
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
    const post = await PostModel.findByPk(id);

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found',
      });
      return;
    }

    const response: ApiResponse<PostOutput> = {
      success: true,
      data: post.toJSON() as PostOutput,
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