import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import { sendWelcomeEmail } from "../utils/mailer";

const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📝 Solicitud de registro recibida");

    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ 
        success: false, 
        message: "Faltan datos obligatorios: username, email y password son requeridos" 
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false, 
        message: "Formato de email inválido" 
      });
      return;
    }

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ 
        success: false, 
        message: "Este email ya está registrado" 
      });
      return;
    }

    const existingUsername = await UserModel.findOne({ where: { username } });
    if (existingUsername) {
      res.status(409).json({ 
        success: false, 
        message: "Este nombre de usuario ya está en uso" 
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
      role: "user",
    });

    console.log(`✅ Usuario creado: ${user.username} (${user.email})`);

    sendWelcomeEmail(email, username)
      .then(() => console.log(`📧 Email de bienvenida enviado a ${email}`))
      .catch((error) => console.error(`⚠️ Error enviando email (no crítico):`, error.message));

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado con éxito",
      token,
      data: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el registro",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔐 Solicitud de login recibida");

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        message: "Email y password son obligatorios" 
      });
      return;
    }

    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: "Credenciales inválidas" 
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ 
        success: false, 
        message: "Credenciales inválidas" 
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "24h" }
    );

    console.log(`✅ Login exitoso para: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor durante el login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};