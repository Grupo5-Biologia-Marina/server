import { body } from "express-validator";

// Validación para registro
export const registerValidation = [
  body("username")
    .notEmpty().withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3 }).withMessage("El nombre debe tener al menos 3 caracteres"),

  body("email")
    .isEmail().withMessage("Debe ser un correo válido"),

  body("password")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
];

// Validación para login
export const loginValidation = [
  body("email")
    .isEmail().withMessage("Debe ser un correo válido"),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
];
