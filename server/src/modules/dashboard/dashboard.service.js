import mongoose from "mongoose";
import Subject from "../subjects/subject.model.js";
import Note from "../notes/note.model.js";
import {
  getUsageCounts,
  getWeeklyActivity,
} from "../activity/activity.service.js";

export const getDashboardStats = async (userId) => {
  const [
    subjects,
    notes,
    pinnedNotes,
    usage,
    weeklyActivity,
    recentNotes,
    notesPerSubjectRaw,
  ] = await Promise.all([
    Subject.countDocuments({ user: userId }),
    Note.countDocuments({ user: userId }),
    Note.countDocuments({ user: userId, pinned: true }),
    getUsageCounts(userId),
    getWeeklyActivity(userId),
    Note.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("subject", "name")
      .select("title updatedAt pinned subject"),
    Note.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
    ]),
  ]);

  const subjectDocs = await Subject.find({ user: userId }).select("name");
  const subjectNameMap = {};
  subjectDocs.forEach((s) => {
    subjectNameMap[s._id.toString()] = s.name;
  });

  const notesPerSubject = notesPerSubjectRaw.map((entry) => ({
    subject: subjectNameMap[entry._id?.toString()] || "Unknown",
    notes: entry.count,
  }));

  const aiUsage = [
    { name: "Summaries", value: usage.summary },
    { name: "Quizzes", value: usage.quiz },
    { name: "Flashcards", value: usage.flashcard },
    { name: "AI Chats", value: usage.chat },
    { name: "PDFs", value: usage.pdf },
  ];

  const totalAiActions =
    usage.summary + usage.quiz + usage.flashcard + usage.chat + usage.pdf;

  // Simple, deterministic "today's goal" progress: how much of a
  // 5-actions-a-day target has been hit today via the activity log.
  const todayActivity = weeklyActivity[weeklyActivity.length - 1]?.activity || 0;
  const dailyGoal = 5;
  const studyProgress = Math.min(
    100,
    Math.round((todayActivity / dailyGoal) * 100)
  );

  return {
    subjects,
    notes,
    pinnedNotes,
    pdfsUploaded: usage.pdf,
    aiChats: usage.chat,
    quizzesGenerated: usage.quiz,
    flashcardsGenerated: usage.flashcard,
    summariesGenerated: usage.summary,
    totalAiActions,
    weeklyActivity,
    aiUsage,
    notesPerSubject,
    recentNotes,
    studyProgress,
    dailyGoal,
    todayActivity,
  };
};
