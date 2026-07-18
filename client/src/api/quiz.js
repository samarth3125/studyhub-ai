import api from "./axios";

export const generateQuiz = async (content) => {
  const { data } = await api.post("/quiz/generate", {
    content,
  });

  return data;
};