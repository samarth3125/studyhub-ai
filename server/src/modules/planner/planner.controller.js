import { logActivity } from "../activity/activity.service.js";
import {
  createTask,
  getTasks,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from "./planner.service.js";

export const addTask = async (req, res) => {
  try {
    const task = await createTask(req.user.id, req.body);
    logActivity(req.user.id, "planner");

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchTasks = async (req, res) => {
  try {
    const tasks = await getTasks(req.user.id, {
      from: req.query.from,
      to: req.query.to,
    });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const editTask = async (req, res) => {
  try {
    const task = await updateTask(req.user.id, req.params.id, req.body);

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleTask = async (req, res) => {
  try {
    const task = await toggleTaskComplete(req.user.id, req.params.id);

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeTask = async (req, res) => {
  try {
    await deleteTask(req.user.id, req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
