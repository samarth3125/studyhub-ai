import api from "./axios";

export const generateMindSpace = async ({ mode, concept, subject }) => {
  const { data } = await api.post("/mindspace/generate", {
    mode,
    concept,
    subject,
  });
  return data;
};

export const saveMindSpaceResponse = async ({
  mode,
  concept,
  response,
  subject,
}) => {
  const { data } = await api.post("/mindspace/save", {
    mode,
    concept,
    response,
    subject,
  });
  return data;
};

export const listSavedResponses = async ({ mode, subject } = {}) => {
  const { data } = await api.get("/mindspace/saved", {
    params: { mode: mode || undefined, subject: subject || undefined },
  });
  return data;
};

export const deleteSavedResponse = async (id) => {
  const { data } = await api.delete(`/mindspace/saved/${id}`);
  return data;
};
