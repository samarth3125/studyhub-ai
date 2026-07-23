import express from "express";
import protect from "../../middleware/auth.middleware.js";

import {
  addTask,
  fetchTasks,
  editTask,
  toggleTask,
  removeTask,
} from "./planner.controller.js";

const router = express.Router();

router.post("/", protect, addTask);
router.get("/", protect, fetchTasks);
router.put("/:id", protect, editTask);
router.patch("/:id/toggle", protect, toggleTask);
router.delete("/:id", protect, removeTask);

export default router;
