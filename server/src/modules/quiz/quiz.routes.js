import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { quiz } from "./quiz.controller.js";

const router = express.Router();

router.post("/generate", protect, quiz);

export default router;