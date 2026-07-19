import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { chatWithAI } from "./chat.controller.js";

const router = express.Router();

router.post("/", protect, chatWithAI);

export default router;