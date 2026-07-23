import express from "express";
import protect from "../../middleware/auth.middleware.js";
import {
  chatWithAI,
  createNewConversation,
  getConversations,
  getSingleConversation,
  renameConversationHandler,
  moveConversationHandler,
  deleteConversationHandler,
  postMessage,
  regenerateHandler,
} from "./chat.controller.js";

const router = express.Router();

// EXISTING — note-scoped Q&A, unchanged.
router.post("/", protect, chatWithAI);

// NEW — AI Workspace conversations.
router.get("/conversations", protect, getConversations);
router.post("/conversations", protect, createNewConversation);
router.get("/conversations/:id", protect, getSingleConversation);
router.patch("/conversations/:id", protect, renameConversationHandler);
router.patch("/conversations/:id/subject", protect, moveConversationHandler);
router.delete("/conversations/:id", protect, deleteConversationHandler);
router.post("/conversations/:id/messages", protect, postMessage);
router.post("/conversations/:id/regenerate", protect, regenerateHandler);

export default router;
