import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Gmail usa SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export const sendWelcomeEmail = async (to: string, username: string) => {
  const htmlContent = `
    <div style="font-family: Arial; color: #0ff; background:#001f2f; padding:2rem; border-radius:1rem;">
      <h1>Hola ${username} 👋</h1>
      <p>Gracias por unirte a <strong>El Gran Azul</strong>! Sumérgete en los misterios del océano y descubre los últimos descubrimientos marinos.</p>
      <a href="${process.env.FRONTEND_URL}/login" style="padding:0.5rem 1rem; background:#00f2ff; color:#001f2f; border-radius:0.5rem; font-weight:bold; text-decoration:none;">Acceder a tu cuenta</a>
    </div>
  `;

  await transporter.sendMail({
    from: `"El Gran Azul 🌊" <${process.env.EMAIL_USER}>`,
    to,
    subject: "¡Bienvenido a El Gran Azul! 🐋",
    html: htmlContent,
  });

  console.log(`✅ Email de bienvenida enviado a ${to} para ${username}`);
};
