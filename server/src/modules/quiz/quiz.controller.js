import { generateQuiz } from "./quiz.service.js";
import { logActivity } from "../activity/activity.service.js";

export const quiz = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const questions = await generateQuiz(content);

    logActivity(req.user.id, "quiz");

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
