import { generateFlashcards } from "./flashcard.service.js";
import { logActivity } from "../activity/activity.service.js";

export const createFlashcards = async (req, res) => {
  try {
    const { content } = req.body;

    const cards = await generateFlashcards(content);

    logActivity(req.user.id, "flashcard");

    res.json({
      success: true,
      cards: cards.cards,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to generate flashcards",
    });
  }
};
