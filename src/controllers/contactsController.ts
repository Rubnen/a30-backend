import { Request, Response } from "express";
import { db, FieldValue } from "../firebase";

export async function listContacts(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user.id;
  const user = await db.collection("users").doc(userId).get();
  if (!user.exists) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
  res.json({ success: true, data: user.data()?.contacts || [] });
}

export async function checkContact(req: Request, res: Response) {
  const contactId = req.params.id;
  const user = await db.collection("users").doc(contactId).get();
  res.json({ success: true, data: { exists: user.exists } });
}

export async function addContact(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user.id;
  const { contactId } = req.body;
  const contactRef = db.collection("users").doc(contactId);
  const contactSnap = await contactRef.get();
  if (!contactSnap.exists) return res.status(404).json({ success: false, message: "Contact non trouvé" });
  await db.collection("users").doc(userId).update({ contacts: FieldValue.arrayUnion(contactId) });
  res.json({ success: true, data: contactSnap.data() });
}