import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { summarize } from "./ai.controller.js";

const router = express.Router();

router.post("/summarize", protect, summarize);

export default router;