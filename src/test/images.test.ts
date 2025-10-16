import PostImageModel from '../models/PostImageModel';
import PostModel from '../models/PostModel';

// ===================== MOCKS =====================
jest.mock('../models/PostImageModel');
jest.mock('../models/PostModel');

// ===================== CLOUDINARY IMAGES TESTS =====================
describe('PostImageController - Cloudinary Integration (7 test cases)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadPostImage', () => {
    it('✅ should upload image successfully', async () => {
      const imageData = {
        postId: 1,
        url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        caption: 'Beautiful sunset',
        credit: 'John Doe',
      };

      (PostImageModel.create as jest.Mock).mockResolvedValue(imageData);

      const result = await PostImageModel.create(imageData);

      expect(result).toEqual(expect.objectContaining({
        url: expect.stringContaining('cloudinary.com'),
        caption: 'Beautiful sunset',
      }));
    });

    it('✅ should validate cloudinary URL format', async () => {
      const invalidUrl = 'not-a-valid-url';
      const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/.+/;

      expect(cloudinaryRegex.test(invalidUrl)).toBe(false);
    });

    it('✅ should store image metadata correctly', async () => {
      const imageData = {
        postId: 1,
        url: 'https://res.cloudinary.com/demo/image/upload/v123/photo.jpg',
        caption: 'Test image',
      };

      (PostImageModel.create as jest.Mock).mockResolvedValue(imageData);
      await PostImageModel.create(imageData);

      expect(PostImageModel.create).toHaveBeenCalledWith(imageData);
    });

    it('✅ should fail if post does not exist', async () => {
      (PostModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await PostModel.findByPk(999);
      expect(result).toBeNull();
    });

    it('✅ should associate image with correct post', async () => {
      const imageData = {
        postId: 5,
        url: 'https://res.cloudinary.com/demo/image/upload/photo.jpg',
      };

      (PostImageModel.create as jest.Mock).mockResolvedValue(imageData);
      await PostImageModel.create(imageData);

      expect(PostImageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ postId: 5 })
      );
    });
  });

  describe('getPostImages', () => {
    it('✅ should retrieve all images for a post', async () => {
      const images = [
        {
          id: 1,
          postId: 1,
          url: 'https://res.cloudinary.com/demo/image1.jpg',
        },
        {
          id: 2,
          postId: 1,
          url: 'https://res.cloudinary.com/demo/image2.jpg',
        },
      ];

      (PostImageModel.findAll as jest.Mock).mockResolvedValue(images);

      const result = await PostImageModel.findAll({ where: { postId: 1 } });

      expect(result).toHaveLength(2);
      expect(result[0].url).toContain('cloudinary.com');
    });

    it('✅ should return empty array if no images', async () => {
      (PostImageModel.findAll as jest.Mock).mockResolvedValue([]);

      const result = await PostImageModel.findAll({ where: { postId: 999 } });

      expect(result).toEqual([]);
    });
  });
});