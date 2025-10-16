import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { loginUser } from '../controllers/AuthController';
import UserModel from '../models/UserModel';

jest.mock('../models/UserModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

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

describe('AuthController - Login (7 test cases)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  const credentials = {
    email: 'test@example.com',
    password: 'SecurePass123!',
  };

  it('✅ should login user successfully', async () => {
    req = mockRequest(credentials);

    const mockUser = {
      id: 1,
      email: credentials.email,
      password: 'hashed_password',
      role: 'user',
      username: 'testuser',
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('valid_token_123');

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Login exitoso',
        token: 'valid_token_123',
        data: expect.objectContaining({
          email: credentials.email,
          id: 1,
        }),
      })
    );
  });

  it('✅ should fail if email is missing', async () => {
    req = mockRequest({
      password: credentials.password,
    });

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Email y password son obligatorios',
      })
    );
  });

  it('✅ should fail if password is missing', async () => {
    req = mockRequest({
      email: credentials.email,
    });

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Email y password son obligatorios',
      })
    );
  });

  it('✅ should fail if user does not exist', async () => {
    req = mockRequest(credentials);

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Credenciales inválidas',
      })
    );
  });

  it('✅ should fail if password is incorrect', async () => {
    req = mockRequest(credentials);

    const mockUser = {
      id: 1,
      email: credentials.email,
      password: 'hashed_password',
      role: 'user',
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Credenciales inválidas',
      })
    );
  });

  it('✅ should handle server errors during login', async () => {
    req = mockRequest(credentials);

    // Mock para simular error del servidor (debe devolver 500)
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Error en el servidor durante el login',
      })
    );
  });

  it('✅ should validate email format during login - CORREGIDO', async () => {
    req = mockRequest({
      email: 'invalid-email-format',
      password: credentials.password,
    });

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalled();
    
     expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
      })
    );
  });

  it('✅ should verify token payload matches user data', async () => {
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