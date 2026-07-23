import { summarizeNote } from "./ai.service.js";
import { logActivity } from "../activity/activity.service.js";

export const summarize = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const summary = await summarizeNote(content);

    logActivity(req.user.id, "summary");

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
