import Note from "./note.model.js";
import Subject from "../subjects/subject.model.js";

export const createNote = async (userId, data) => {
  const subject = await Subject.findOne({
    _id: data.subject,
    user: userId,
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  return await Note.create({
    ...data,
    user: userId,
  });
};

export const getNotes = async (userId, subjectId) => {
  return await Note.find({
    user: userId,
    subject: subjectId,
  }).sort({ createdAt: -1 });
};

export const updateNote = async (userId, noteId, data) => {
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};