import { askAI } from "./chat.service.js";

export const chatWithAI = async (req, res) => {
  try {
    const { note, question } = req.body;

    if (!note || !question) {
      return res.status(400).json({
        success: false,
        message: "Note and question are required",
      });
    }

    const answer = await askAI(note, question);

    res.json({
      success: true,
      answer,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "AI chat failed",
    });
  }
};