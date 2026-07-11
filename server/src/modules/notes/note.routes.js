import express from "express";
import protect from "../../middleware/auth.middleware.js";

import {
  addNote,
  fetchNotes,
  editNote,
  removeNote,
} from "./note.controller.js";

const router = express.Router();

router.post("/", protect, addNote);

router.get(
  "/subject/:subjectId",
  protect,
  fetchNotes
);

router.put("/:id", protect, editNote);

router.delete("/:id", protect, removeNote);

export default router;