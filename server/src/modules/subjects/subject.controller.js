import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
} from "./subject.service.js";

export const addSubject = async (req, res) => {
  try {
    const subject = await createSubject(req.user.id, req.body);

    res.status(201).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchSubjects = async (req, res) => {
  try {
    const subjects = await getSubjects(req.user.id);

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const editSubject = async (req, res) => {
  try {
    const subject = await updateSubject(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeSubject = async (req, res) => {
  try {
    await deleteSubject(req.user.id, req.params.id);

    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};