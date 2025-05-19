import { Request, Response } from "express";
import { db } from "../firebase";

export async function listConversations(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user.id;
  const conversations = await db
    .collection("conversations")
    .where("users", "array-contains", userId)
    .get();
  const data = conversations.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json({ success: true, data });
}

export async function createConversation(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user.id;
  const { contactId } = req.body;
  // Vérifier si conversation existe déjà
  const existing = await db
    .collection("conversations")
    .where("users", "in", [[userId, contactId], [contactId, userId]])
    .get();
  if (!existing.empty) {
    return res.json({ success: true, data: { id: existing.docs[0].id, ...existing.docs[0].data() } });
  }
  const doc = await db.collection("conversations").add({
    users: [userId, contactId],
    createdAt: new Date(),
  });
  res.json({ success: true, data: { id: doc.id } });
}