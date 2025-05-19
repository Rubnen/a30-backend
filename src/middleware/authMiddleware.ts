import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "changeme!";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: "Token manquant" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token invalide" });
    // @ts-ignore
    req.user = user;
    next();
  });
}