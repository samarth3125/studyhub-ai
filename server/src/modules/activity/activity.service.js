import mongoose from "mongoose";
import Activity from "./activity.model.js";

/**
 * Fire-and-forget activity logger.
 * Never throws — a logging failure must never break an existing
 * feature (PDF upload, quiz generation, etc). Call this without
 * awaiting it inside existing controllers.
 */
export const logActivity = (userId, type) => {
  Activity.create({ user: userId, type }).catch((err) => {
    console.error("Activity log failed:", err.message);
  });
};

export const getUsageCounts = async (userId) => {
  const results = await Activity.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const counts = {
    pdf: 0,
    quiz: 0,
    flashcard: 0,
    chat: 0,
    summary: 0,
    mindspace: 0,
    planner: 0,
  };

  results.forEach((r) => {
    if (counts[r._id] !== undefined) counts[r._id] = r.count;
  });

  return counts;
};

export const getWeeklyActivity = async (userId) => {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  const start = days[0];

  const raw = await Activity.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const map = {};
  raw.forEach((r) => {
    map[r._id] = r.count;
  });

  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    return {
      day: labels[d.getDay()],
      date: key,
      activity: map[key] || 0,
    };
  });
};
