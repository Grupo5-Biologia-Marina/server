import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import LikeModel from '../models/LikeModel';
import PostModel from '../models/PostModel';
import { ApiResponse } from '../types/posts';

export const toggleLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: postId } = req.params;

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;

    const post = await PostModel.findByPk(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const existingLike = await LikeModel.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      await existingLike.destroy();
      
      const response: ApiResponse<{ liked: boolean }> = {
        success: true,
        data: { liked: false },
        message: 'Like removed',
      };
      res.status(200).json(response);
    } else {
      await LikeModel.create({ userId: Number(userId), postId: Number(postId) });
      
      const response: ApiResponse<{ liked: boolean }> = {
        success: true,
        data: { liked: true },
        message: 'Like added',
      };
      res.status(200).json(response);
    }

  } catch (error: any) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like',
      error: error.message,
    });
  }
};

export const getLikeInfo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id: postId } = req.params;

    const likesCount = await LikeModel.count({ where: { postId } });

    let isLikedByUser = false;
    if (req.user) {
      const userLike = await LikeModel.findOne({
        where: { userId: req.user.id, postId }
      });
      isLikedByUser = !!userLike;
    }

    const response: ApiResponse<{ likesCount: number; isLikedByUser: boolean }> = {
      success: true,
      data: { likesCount, isLikedByUser },
      message: 'Like info fetched successfully',
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error fetching like info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching like info',
      error: error.message,
    });
  }
};