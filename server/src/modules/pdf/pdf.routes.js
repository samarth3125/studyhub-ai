import express from "express";
console.log("✅ PDF Routes Loaded");
import multer from "multer";
import protect from "../../middleware/auth.middleware.js";
import { uploadPDF } from "./pdf.controller.js";

const router = express.Router();

// Store file in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadPDF
);

export default router;