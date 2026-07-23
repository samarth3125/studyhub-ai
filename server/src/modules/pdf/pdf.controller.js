import { extractPDFText } from "./pdf.service.js";
import { logActivity } from "../activity/activity.service.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF uploaded",
      });
    }

    const text = await extractPDFText(req.file.buffer);

    logActivity(req.user.id, "pdf");

    res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to process PDF",
    });
  }
};
