import api from "./axios";

// EXISTING — note-scoped Q&A. Unchanged.
export const askAI = async (note, question) => {
  const { data } = await api.post("/chat", {
    note,
    question,
  });

  return data;
};

// NEW — AI Workspace conversations.
export const listConversations = async ({ search, subject } = {}) => {
  const { data } = await api.get("/chat/conversations", {
    params: { search: search || undefined, subject: subject || undefined },
  });
  return data;
};

export const createConversation = async ({ subject, title } = {}) => {
  const { data } = await api.post("/chat/conversations", { subject, title });
  return data;
};

export const getConversation = async (id) => {
  const { data } = await api.get(`/chat/conversations/${id}`);
  return data;
};

export const renameConversation = async (id, title) => {
  const { data } = await api.patch(`/chat/conversations/${id}`, { title });
  return data;
};

export const moveConversation = async (id, subject) => {
  const { data } = await api.patch(`/chat/conversations/${id}/subject`, {
    subject,
  });
  return data;
};

export const deleteConversation = async (id) => {
  const { data } = await api.delete(`/chat/conversations/${id}`);
  return data;
};

export const sendWorkspaceMessage = async (id, content) => {
  const { data } = await api.post(`/chat/conversations/${id}/messages`, {
    content,
  });
  return data;
};

export const regenerateResponse = async (id) => {
  const { data } = await api.post(`/chat/conversations/${id}/regenerate`);
  return data;
};
