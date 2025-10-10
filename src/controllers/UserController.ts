import { Request, Response } from "express";
import crypto from "crypto";
import UserModel from "../models/UserModel";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, firstname, lastname, email, password, role, img } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email y password son obligatorios",
      });
      return;
    }

    const hashedPassword = hashPassword(password);

    const user = await UserModel.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || "user",
      img,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        img: user.img,
      },
      message: "Usuario creado exitosamente",
    });
  } catch (error: any) {
    console.error("Error creando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al crear usuario",
      error: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.findAll({
      attributes: ["id", "username", "firstname", "lastname", "email", "role", "img"],
    });

    res.status(200).json({
      success: true,
      data: users,
      message: "Usuarios obtenidos correctamente",
    });
  } catch (error: any) {
    console.error("Error obteniendo usuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al obtener usuarios",
      error: error.message,
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id, {
      attributes: ["id", "username", "firstname", "lastname", "email", "role", "img"],
    });

    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Usuario obtenido correctamente",
    });
  } catch (error: any) {
    console.error("Error obteniendo usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al obtener usuario",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, firstname, lastname, email, password, role, img } = req.body;

    const user = await UserModel.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    const updatedData: any = {
      username,
      firstname,
      lastname,
      email,
      role,
      img,
    };

    if (password) {
      updatedData.password = hashPassword(password);
    }

    await user.update(updatedData);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        img: user.img,
      },
      message: "Usuario actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al actualizar usuario",
      error: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
      return;
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      data: null,
      message: "Usuario eliminado correctamente",
    });
  } catch (error: any) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor al eliminar usuario",
      error: error.message,
    });
  }
};