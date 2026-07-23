import PlannerTask from "./planner.model.js";

export const createTask = async (userId, data) => {
  if (!data.title || !data.date) {
    throw new Error("Title and date are required");
  }

  return await PlannerTask.create({
    title: data.title,
    type: data.type || "study",
    date: data.date,
    time: data.time || "",
    notes: data.notes || "",
    subject: data.subject || null,
    user: userId,
  });
};

// Returns tasks in a date range (inclusive), or all tasks if no range
// is given. Used for both the monthly calendar view and the
// "today's tasks" widget.
export const getTasks = async (userId, { from, to } = {}) => {
  const query = { user: userId };

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  return await PlannerTask.find(query)
    .sort({ date: 1, time: 1 })
    .populate("subject", "name");
};

export const updateTask = async (userId, taskId, data) => {
  const task = await PlannerTask.findOneAndUpdate(
    { _id: taskId, user: userId },
    data,
    { new: true, runValidators: true }
  ).populate("subject", "name");

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const toggleTaskComplete = async (userId, taskId) => {
  const task = await PlannerTask.findOne({ _id: taskId, user: userId });

  if (!task) {
    throw new Error("Task not found");
  }

  task.completed = !task.completed;
  await task.save();

  return task;
};

export const deleteTask = async (userId, taskId) => {
  const task = await PlannerTask.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};
