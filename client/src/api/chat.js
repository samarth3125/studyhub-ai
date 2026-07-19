import api from "./axios";

export const askAI = async (note, question) => {
  const { data } = await api.post("/chat", {
    note,
    question,
  });

  return data;
};