import { Request, Response } from "express";
import { db } from "../firebase";

export async function getMessages(req: Request, res: Response) {
  const { conversationId } = req.params;
  const messages = await db
    .collection("conversations")
    .doc(conversationId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .get();
  const data = messages.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json({ success: true, data });
}

export async function sendMessage(req: Request, res: Response) {
  // @ts-ignore
  const userId = req.user.id;
  const { conversationId } = req.params;
  const { text } = req.body;
  const message = {
    userId,
    text,
    createdAt: new Date(),
  };
  const doc = await db
    .collection("conversations")
    .doc(conversationId)
    .collection("messages")
    .add(message);
  res.json({ success: true, data: { id: doc.id, ...message } });
}