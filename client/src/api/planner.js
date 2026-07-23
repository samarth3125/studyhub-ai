import api from "./axios";

export const listTasks = async ({ from, to } = {}) => {
  const { data } = await api.get("/planner", {
    params: { from: from || undefined, to: to || undefined },
  });
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/planner", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.put(`/planner/${id}`, payload);
  return data;
};

export const toggleTask = async (id) => {
  const { data } = await api.patch(`/planner/${id}/toggle`);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/planner/${id}`);
  return data;
};
