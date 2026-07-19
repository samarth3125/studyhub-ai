import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createFlashcards } from "./flashcard.controller.js";

const router = express.Router();

router.post("/", protect, createFlashcards);

export default router;