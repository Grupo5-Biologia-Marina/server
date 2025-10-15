import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/auth";

export const checkRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const { id } = req.params;

      // Caso 1: si el rol del usuario está incluido en los roles permitidos
      if (roles.includes(user.role)) {
        return next();
      }

      // Caso 2: si no está incluido, pero está accediendo a su propio recurso
      if (id && user.id === id) {
        return next();
      }

      return res.status(403).json({ message: "No tienes permisos para acceder a este recurso" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  };
};
