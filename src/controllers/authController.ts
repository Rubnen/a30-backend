import { Request, Response } from "express";
import { db } from "../firebase";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET || "changeme!";
const SALT_ROUNDS = 10;

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("email", "==", email).get();
  if (snapshot.empty) {
    return res.status(401).json({ success: false, message: "Identifiants invalides" });
  }
  const doc = snapshot.docs[0];
  const user = doc.data();

  // Vérifie le mot de passe hashé
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ success: false, message: "Identifiants invalides" });
  }

  const payload = { id: doc.id, email: user.email, fullName: user.fullName };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  res.json({ success: true, data: { ...payload, token } });
}

export async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body;
  const usersRef = db.collection("users");
  const snapshot = await usersRef.where("email", "==", email).get();
  if (!snapshot.empty) {
    return res.status(409).json({ success: false, message: "Email déjà utilisé" });
  }

  // Hash le mot de passe AVANT de le stocker
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const doc = await usersRef.add({ email, password: hashedPassword, fullName, contacts: [] });
  const payload = { id: doc.id, email, fullName };
  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  res.json({ success: true, data: { ...payload, token } });
}