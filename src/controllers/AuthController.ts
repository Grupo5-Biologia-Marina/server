import { Request, Response } from "express";
import crypto from "crypto";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";

const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
      return;
    }

    const hashedPassword = hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado con éxito",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el registro",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email y password son obligatorios" });
      return;
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el login",
      error: error.message,
    });
  }
};