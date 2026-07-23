import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  togglePinNote,
} from "./note.service.js";

export const addNote = async (req, res) => {
  try {
    const note = await createNote(req.user.id, req.body);

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchNotes = async (req, res) => {
  try {
    const notes = await getNotes(
      req.user.id,
      req.params.subjectId
    );

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const editNote = async (req, res) => {
  try {
    const note = await updateNote(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeNote = async (req, res) => {
  try {
    await deleteNote(req.user.id, req.params.id);

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePin = async (req, res) => {
  try {
    const note = await togglePinNote(req.user.id, req.params.id);

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
