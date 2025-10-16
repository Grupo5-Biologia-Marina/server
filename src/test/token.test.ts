import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerUser, loginUser } from '../controllers/AuthController';
import UserModel from '../models/UserModel';

// ===================== MOCKS =====================
jest.mock('../models/UserModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/mailer', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
};

const mockRequest = (data?: any): Partial<Request> => {
  return {
    body: data || {},
    headers: {},
    params: {},
  };
};

// ===================== JWT TOKEN TESTS =====================
describe('JWT Token Generation (2 test cases)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  it('✅ should generate JWT token with correct payload during registration', async () => {
    const userData = {
      username: 'testuser',
      firstname: 'Test',
      lastname: 'User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    };

    req = mockRequest(userData);

    const mockUser = { 
      id: 1, 
      ...userData, 
      password: 'hashed',
      role: 'user'
    };

    (UserModel.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    (bcrypt.genSaltSync as jest.Mock).mockReturnValue('salt');
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed');
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue('jwt_token');

    await registerUser(req as Request, res as Response);

    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        role: 'user',
        username: userData.username,
      }),
      expect.any(String),
      { expiresIn: '24h' }
    );
  });

  it('✅ should verify token payload matches user data during login', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'SecurePass123!',
    };

    req = mockRequest(credentials);

    const mockUser = {
      id: 1,
      email: credentials.email,
      password: 'hashed',
      role: 'user',
      username: 'testuser',
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    await loginUser(req as Request, res as Response);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: 1,
        role: 'user',
        username: 'testuser',
      },
      expect.any(String),
      { expiresIn: '24h' }
    );
  });
});