import express from "express";
import protect from "../../middleware/auth.middleware.js";

import {
  addSubject,
  fetchSubjects,
  editSubject,
  removeSubject,
} from "./subject.controller.js";

const router = express.Router();

router.post("/", protect, addSubject);
router.get("/", protect, fetchSubjects);
router.put("/:id", protect, editSubject);
router.delete("/:id", protect, removeSubject);

export default router;