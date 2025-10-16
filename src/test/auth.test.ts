import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerUser } from '../controllers/AuthController';
import UserModel from '../models/UserModel';


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

describe('AuthController - Register (6 test cases)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  const userData = {
    username: 'testuser',
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    password: 'SecurePass123!',
  };

  it('✅ should register a new user successfully', async () => {
    req = mockRequest(userData);

    const mockUser = {
      id: 1,
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: 'hashed_password',
      role: 'user',
    };

    (UserModel.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    (bcrypt.genSaltSync as jest.Mock).mockReturnValue('salt');
    (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed_password');
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue('valid_token_123');

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Usuario registrado con éxito',
        token: 'valid_token_123',
        data: expect.objectContaining({
          email: userData.email,
          username: userData.username,
        }),
      })
    );
  });

  it('✅ should fail if required fields are missing', async () => {
    req = mockRequest({
      username: 'testuser',
    });

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Faltan datos obligatorios'),
      })
    );
  });

  it('✅ should fail if email format is invalid', async () => {
    req = mockRequest({
      ...userData,
      email: 'invalid-email',
    });

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Formato de email inválido',
      })
    );
  });

  it('✅ should fail if email already exists', async () => {
    req = mockRequest(userData);

    (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
      email: userData.email,
    });

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Este email ya está registrado',
      })
    );
  });

  it('✅ should fail if username already exists', async () => {
    req = mockRequest(userData);

    (UserModel.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ username: userData.username });

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Este nombre de usuario ya está en uso',
      })
    );
  });

  it('✅ should handle server errors during registration', async () => {
    req = mockRequest(userData);

    (UserModel.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    (UserModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

    await registerUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Error en el servidor durante el registro',
      })
    );
  });
});