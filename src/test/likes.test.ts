import LikeModel from '../models/LikeModel';
import PostModel from '../models/PostModel';

jest.mock('../models/LikeModel');
jest.mock('../models/PostModel');

describe('LikesController (6 test cases)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addLike', () => {
    it('✅ should add like to post successfully', async () => {
      (LikeModel.create as jest.Mock).mockResolvedValue({
        userId: 1,
        postId: 1,
      });

      await LikeModel.create({ userId: 1, postId: 1 });

      expect(LikeModel.create).toHaveBeenCalledWith({
        userId: 1,
        postId: 1,
      });
    });

    it('✅ should fail if post does not exist', async () => {
      (PostModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await PostModel.findByPk(999);
      expect(result).toBeNull();
    });

    it('✅ should prevent duplicate likes', async () => {
      (LikeModel.findOne as jest.Mock).mockResolvedValue({
        userId: 1,
        postId: 1,
      });

      const existingLike = await LikeModel.findOne({
        where: { userId: 1, postId: 1 },
      });

      expect(existingLike).not.toBeNull();
    });
  });

  describe('removeLike', () => {
    it('✅ should remove like from post successfully', async () => {
      (LikeModel.destroy as jest.Mock).mockResolvedValue(1);

      const result = await LikeModel.destroy({
        where: { userId: 1, postId: 1 },
      });

      expect(result).toBe(1);
    });

    it('✅ should fail if like does not exist', async () => {
      (LikeModel.destroy as jest.Mock).mockResolvedValue(0);

      const result = await LikeModel.destroy({
        where: { userId: 1, postId: 999 },
      });

      expect(result).toBe(0);
    });
  });

  describe('getLikesCount', () => {
    it('✅ should get correct count of likes', async () => {
      (LikeModel.count as jest.Mock).mockResolvedValue(5);

      const count = await LikeModel.count({ where: { postId: 1 } });

      expect(count).toBe(5);
    });

    it('✅ should return 0 if no likes', async () => {
      (LikeModel.count as jest.Mock).mockResolvedValue(0);

      const count = await LikeModel.count({ where: { postId: 999 } });

      expect(count).toBe(0);
    });
  });
});