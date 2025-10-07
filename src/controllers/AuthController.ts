import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";

const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Register request body:", req.body);

    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
      return;
    }

    const hashedPassword = hashPassword(password); 

    const user = await UserModel.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "user",
    });

    console.log("Usuario creado:", user.id, user.email); 

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado con éxito",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error registerUser:", error); 
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el registro",
      error: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email y password son obligatorios" });
      return;
    }

    const user = await UserModel.findOne({ where: { email } });
    console.log("Usuario encontrado:", user ? user.email : "no user");

    if (!user) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    console.log("Login exitoso, token generado");

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
    });
  } catch (error: any) {
    console.error("Error loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el login",
      error: error.message,
    });
  }
};
