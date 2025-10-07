import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Función para hashear contraseña
const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// Configuración de nodemailer con Gmail + App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // tu email, ejemplo: elgranazul@gmail.com
    pass: process.env.EMAIL_PASS, // la App Password generada en Gmail
  },
});

const sendWelcomeEmail = async (email: string, username: string) => {
  const htmlContent = `
    <div style="font-family: Arial; color: #0ff; background:#001f2f; padding:2rem; border-radius:1rem;">
      <h1>Hola ${username} 👋</h1>
      <p>Gracias por unirte a <strong>El Gran Azul</strong>! Sumérgete en los misterios del océano y descubre los últimos descubrimientos marinos.</p>
      <a href="${process.env.FRONTEND_URL}/login" style="padding:0.5rem 1rem; background:#00f2ff; color:#001f2f; border-radius:0.5rem; font-weight:bold; text-decoration:none;">Acceder a tu cuenta</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"El Gran Azul 🌊" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "¡Bienvenido a El Gran Azul! 🐋",
    html: htmlContent,
  });

  console.log(`Email de bienvenida enviado a ${email} para ${username}`);
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Register request body:", req.body);

    const { username, email, password, firstname, lastname } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
      return;
    }

    const hashedPassword = hashPassword(password);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role: "user",
    });

    console.log("Usuario creado:", user.id, user.email);

    // ✅ Enviar email de bienvenida
    await sendWelcomeEmail(email, username);

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
      { id: user.id, role: user.role, username: user.username },
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
