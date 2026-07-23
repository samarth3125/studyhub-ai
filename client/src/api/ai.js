import api from "./axios";

export const summarizeNote = async (content) => {
  const res = await api.post("/ai/summarize", {
    content,
  });

  return res.data;
};