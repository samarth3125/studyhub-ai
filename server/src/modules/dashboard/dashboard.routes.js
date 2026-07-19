import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { fetchDashboardStats } from "./dashboard.controller.js";

const router = express.Router();

router.get("/stats", protect, fetchDashboardStats);

export default router;