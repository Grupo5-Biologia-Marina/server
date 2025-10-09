import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

<<<<<<< HEAD
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded; // guardamos info del user en la request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}
=======
export interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ success: false, message: "Invalid token format" });

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret) as { id: number; role: string };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
>>>>>>> f159b673538c5c32c7ee08a952087040a5167a68
