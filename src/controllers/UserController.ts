import { Response, NextFunction } from "express";
import UserModel from "../models/UserModel";
import { ApiResponse } from "../types/types";
import { AuthenticatedRequest } from "../types/auth";

// GET /users → todos los usuarios (solo admin)
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      const err = new Error("Forbidden: Admins only");
      (err as any).statusCode = 403;
      throw err;
    }

    const users = await UserModel.findAll({
      attributes: ["id", "username", "email", "role"]
    });

    const response: ApiResponse<any[]> = {
      success: true,
      message: "Users fetched successfully",
      data: users
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// GET /users/:id → info de un usuario
export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id, {
      attributes: ["id", "username", "email", "role"]
    });

    if (!user) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const response: ApiResponse<any> = {
      success: true,
      message: "User fetched successfully",
      data: user
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// PATCH /users/:id/role → cambiar rol de usuario (solo admin)
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!req.user || req.user.role !== "ADMIN") {
      const err = new Error("Forbidden: Admins only");
      (err as any).statusCode = 403;
      throw err;
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    user.role = role;
    await user.save();

    const response: ApiResponse<any> = {
      success: true,
      message: "User role updated successfully",
      data: { id: user.id, username: user.username, role: user.role }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};