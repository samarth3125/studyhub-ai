import api from "./axios";

export const generateFlashcards = async (content) => {
  const { data } = await api.post("/flashcards", {
    content,
  });

  return data;
};                                                                  