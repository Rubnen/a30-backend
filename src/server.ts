import express from "express";
import cors from "cors";
import { authenticateToken } from "./middleware/authMiddleware";
import {
    login,
    register,
    listContacts,
    checkContact,
    addContact,
    listConversations,
    createConversation,
    getMessages,
    sendMessage
} from "./controllers";

const app = express();
app.use(cors());
app.use(express.json());

// Auth
app.post("/auth/login", login);
app.post("/auth/register", register);

// Contacts
app.get("/contacts", authenticateToken, listContacts);
app.get("/contacts/check/:id", authenticateToken, checkContact);
app.post("/contacts/add", authenticateToken, addContact);

// Conversations
app.get("/conversations", authenticateToken, listConversations);
app.post("/conversations/create", authenticateToken, createConversation);

// Messages
app.get("/messages/:conversationId", authenticateToken, getMessages);
app.post("/messages/:conversationId", authenticateToken, sendMessage);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API Firebase backend running on port ${PORT}`);
});