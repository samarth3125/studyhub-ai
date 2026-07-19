import Subject from "../subjects/subject.model.js";
import Note from "../notes/note.model.js";

export const getDashboardStats = async (userId) => {
  const [subjects, notes] = await Promise.all([
    Subject.countDocuments({ user: userId }),
    Note.countDocuments({ user: userId }),
  ]);

  return {
    subjects,
    notes,
  };
};