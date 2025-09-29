import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { ApiResponse } from "../types/types";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// POST /auth/register
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      const err = new Error("Email already in use");
      (err as any).statusCode = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    const response: ApiResponse<any> = {
      success: true,
      message: "User created successfully",
      data: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// POST /auth/login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      const err = new Error("Invalid credentials");
      (err as any).statusCode = 401;
      throw err;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const err = new Error("Invalid credentials");
      (err as any).statusCode = 401;
      throw err;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    const response: ApiResponse<any> = {
      success: true,
      message: "Login successful",
      data: { token, id: user.id, username: user.username, role: user.role }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};