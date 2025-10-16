import nodemailer from "nodemailer";
import * as path from "path";

const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASS) {
    throw new Error('❌ Faltan variables de entorno: EMAIL_USER o EMAIL_APP_PASS');
  }
  
  console.log("✅ Configuración de email validada");
  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
};

const createTransporter = () => {
  validateEmailConfig();
  
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export const sendWelcomeEmail = async (to: string, username: string) => {
  console.log(`\n📨 Intentando enviar email de bienvenida a: ${to}`);
  
  const transporter = createTransporter();
  
  try {
    await transporter.verify();
    console.log("✅ Conexión con servidor SMTP verificada");
  } catch (error) {
    console.error("❌ Error de conexión SMTP:", error);
    throw new Error("No se pudo conectar con Gmail. Verifica tus credenciales.");
  }

  const logoPath = path.join(__dirname, "../assets/logo.png");
  console.log("📁 Ruta del logo:", logoPath);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenid@ a El Gran Azul</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f8ff;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0f8ff;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: linear-gradient(180deg, #003d5c 0%, #001f2f 100%); border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 63, 92, 0.3); overflow: hidden;">
              
              <!-- Header con logo -->
              <tr>
                <td align="center" style="padding: 50px 30px 30px 30px; background: linear-gradient(135deg, rgba(0, 242, 255, 0.1) 0%, transparent 100%);">
                  <img src="cid:logo" alt="El Gran Azul Logo" style="max-width: 160px; height: auto; display: block; filter: drop-shadow(0 4px 12px rgba(0, 242, 255, 0.3));" />
                </td>
              </tr>

              <!-- Título de bienvenida -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding-bottom: 20px;">
                        <h1 style="margin: 0; color: #00f2ff; font-size: 36px; font-weight: 700; text-shadow: 0 2px 20px rgba(0, 242, 255, 0.4); letter-spacing: 0.5px; line-height: 1.2;">
                          ¡Bienvenid@, <span style="color: #ffffff;">${username}</span>!
                        </h1>
                        <div style="margin-top: 15px; height: 3px; width: 80px; background: linear-gradient(90deg, transparent, #00f2ff, transparent); margin-left: auto; margin-right: auto;"></div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contenido principal -->
              <tr>
                <td style="padding: 0 30px 40px 30px;">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; background: rgba(0, 62, 93, 0.4); border-radius: 12px; border: 1px solid rgba(0, 242, 255, 0.2); backdrop-filter: blur(10px);">
                    <tr>
                      <td style="padding: 30px;">
                        <p style="margin: 0 0 18px 0; color: #e0f4ff; line-height: 1.7; font-size: 16px; text-align: center;">
                          🌊 Gracias por unirte a <strong style="color: #00f2ff; font-size: 18px;">El Gran Azul</strong>
                        </p>
                        <p style="margin: 0; color: #b8dff0; line-height: 1.7; font-size: 15px; text-align: center;">
                          Tu plataforma de exploración marina donde podrás sumergirte en los misterios del océano y descubrir los últimos hallazgos de biología marina junto a nuestra comunidad de exploradores.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Botón de acción -->
              <tr>
                <td align="center" style="padding: 0 30px 50px 30px;">
                  <table role="presentation" style="border-collapse: collapse;">
                    <tr>
                      <td align="center" style="border-radius: 8px; background: linear-gradient(135deg, #00f2ff 0%, #00b8d4 100%); box-shadow: 0 6px 25px rgba(0, 242, 255, 0.4);">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                           style="display: inline-block; padding: 18px 45px; color: #001f2f; font-size: 16px; font-weight: 700; text-decoration: none; letter-spacing: 0.5px; text-transform: uppercase;">
                          🐠 Explorar ahora
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 30px 40px 30px; background: rgba(0, 0, 0, 0.2);">
                  <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 1px solid rgba(0, 242, 255, 0.3); padding-top: 20px;">
                    <tr>
                      <td align="center">
                        <p style="margin: 0 0 12px 0; color: #7ac5d4; font-size: 14px; line-height: 1.5;">
                          ¿Necesitas ayuda? Estamos aquí para ti 🤿
                        </p>
                        <p style="margin: 0 0 15px 0; color: #7ac5d4; font-size: 14px;">
                          <a href="mailto:${process.env.EMAIL_USER}" style="color: #00f2ff; text-decoration: none; font-weight: 600;">
                            ${process.env.EMAIL_USER}
                          </a>
                        </p>
                        <p style="margin: 0; color: #5a8a9a; font-size: 13px;">
                          © ${new Date().getFullYear()} El Gran Azul. Todos los derechos reservados.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const textContent = `
Hola ${username},

¡Bienvenid@ a El Gran Azul!

Gracias por unirte a nuestra plataforma de exploración marina. Ahora puedes acceder a los últimos descubrimientos y conectar con nuestra comunidad de entusiastas de la biología marina.

Accede a tu cuenta aquí: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login

¿Necesitas ayuda? Contáctanos en: ${process.env.EMAIL_USER}

© ${new Date().getFullYear()} El Gran Azul. Todos los derechos reservados.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"El Gran Azul 🌊" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🐋 ¡Bienvenid@ a El Gran Azul! Tu cuenta está lista",
      html: htmlContent,
      text: textContent,
      replyTo: process.env.EMAIL_USER,
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'El Gran Azul Mailer',
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
      } as Record<string, string>,
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "logo",
        },
      ],
    });

    console.log(`✅ Email enviado exitosamente a ${to}`);
    console.log(`📬 Message ID: ${info.messageId || 'N/A'}`);
    return { success: true, messageId: info.messageId || '' };
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        throw new Error('Credenciales inválidas. Verifica EMAIL_USER y EMAIL_APP_PASS en .env');
      }
      if (error.message.includes('ECONNECTION') || error.message.includes('ETIMEDOUT')) {
        throw new Error('No se pudo conectar con Gmail. Verifica tu conexión a internet.');
      }
      if (error.message.includes('ENOENT')) {
        throw new Error('No se encontró el archivo logo.png en src/assets/');
      }
    }
    
    throw error;
  }
};