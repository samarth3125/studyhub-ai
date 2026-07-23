import { generateMindSpaceResponse, MODES } from "./mindspace.service.js";
import SavedResponse from "./mindspace.model.js";
import Subject from "../subjects/subject.model.js";
import { logActivity } from "../activity/activity.service.js";

export const getModes = async (_req, res) => {
  res.json({ success: true, modes: MODES });
};

export const generate = async (req, res) => {
  try {
    const { mode, concept, subject } = req.body;

    if (!mode || !concept?.trim()) {
      return res.status(400).json({
        success: false,
        message: "A mode and a concept are required",
      });
    }

    let subjectName = null;
    if (subject) {
      const subjectDoc = await Subject.findOne({
        _id: subject,
        user: req.user.id,
      }).select("name");
      subjectName = subjectDoc?.name || null;
    }

    const response = await generateMindSpaceResponse(
      mode,
      concept.trim(),
      subjectName
    );

    logActivity(req.user.id, "mindspace");

    res.json({
      success: true,
      mode,
      concept: concept.trim(),
      subject: subject || null,
      response,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Generation failed",
    });
  }
};

export const saveResponse = async (req, res) => {
  try {
    const { mode, concept, response, subject } = req.body;

    if (!mode || !concept?.trim() || !response?.trim()) {
      return res.status(400).json({
        success: false,
        message: "mode, concept and response are required",
      });
    }

    const saved = await SavedResponse.create({
      user: req.user.id,
      mode,
      concept: concept.trim(),
      response,
      subject: subject || null,
    });

    res.status(201).json({ success: true, saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not save this response",
    });
  }
};

export const listSaved = async (req, res) => {
  try {
    const { mode, subject } = req.query;
    const query = { user: req.user.id };

    if (mode) query.mode = mode;
    if (subject) query.subject = subject;

    const saved = await SavedResponse.find(query)
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Could not load saved responses",
    });
  }
};

export const deleteSaved = async (req, res) => {
  try {
    const deleted = await SavedResponse.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Saved response not found",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};
