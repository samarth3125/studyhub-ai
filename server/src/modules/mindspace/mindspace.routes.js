import express from "express";
import protect from "../../middleware/auth.middleware.js";
import {
  getModes,
  generate,
  saveResponse,
  listSaved,
  deleteSaved,
} from "./mindspace.controller.js";

const router = express.Router();

router.get("/modes", protect, getModes);
router.post("/generate", protect, generate);
router.post("/save", protect, saveResponse);
router.get("/saved", protect, listSaved);
router.delete("/saved/:id", protect, deleteSaved);

export default router;
