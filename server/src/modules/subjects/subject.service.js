import Subject from "./subject.model.js";

export const createSubject = async (userId, data) => {
  return await Subject.create({
    ...data,
    user: userId,
  });
};

export const getSubjects = async (userId) => {
  return await Subject.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

export const updateSubject = async (userId, subjectId, data) => {
  const subject = await Subject.findOneAndUpdate(
    {
      _id: subjectId,
      user: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!subject) {
    throw new Error("Subject not found");
  }

  return subject;
};

export const deleteSubject = async (userId, subjectId) => {
  const subject = await Subject.findOneAndDelete({
    _id: subjectId,
    user: userId,
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  return subject;
};