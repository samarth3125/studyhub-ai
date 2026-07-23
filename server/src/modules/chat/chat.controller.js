import {
  askAI,
  createConversation,
  listConversations,
  getConversation,
  renameConversation,
  moveConversationToSubject,
  deleteConversation,
  sendMessage,
  regenerateLastResponse,
} from "./chat.service.js";
import { logActivity } from "../activity/activity.service.js";

// ---------------------------------------------------------------------
// EXISTING FEATURE — do not remove. Note-scoped Q&A.
// ---------------------------------------------------------------------
export const chatWithAI = async (req, res) => {
  try {
    const { note, question } = req.body;

    if (!note || !question) {
      return res.status(400).json({
        success: false,
        message: "Note and question are required",
      });
    }

    const answer = await askAI(note, question);

    logActivity(req.user.id, "chat");

    res.json({
      success: true,
      answer,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "AI chat failed",
    });
  }
};

// ---------------------------------------------------------------------
// NEW — AI Workspace conversations
// ---------------------------------------------------------------------

const handleError = (res, error, fallback = "Something went wrong") => {
  console.error(error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || fallback,
  });
};

export const createNewConversation = async (req, res) => {
  try {
    const { subject, title } = req.body || {};
    const conversation = await createConversation(req.user.id, {
      subject,
      title,
    });

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not create conversation");
  }
};

export const getConversations = async (req, res) => {
  try {
    const { search, subject } = req.query;
    const conversations = await listConversations(req.user.id, {
      search,
      subject,
    });

    res.json({ success: true, conversations });
  } catch (error) {
    handleError(res, error, "Could not load conversations");
  }
};

export const getSingleConversation = async (req, res) => {
  try {
    const conversation = await getConversation(req.user.id, req.params.id);
    res.json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not load conversation");
  }
};

export const renameConversationHandler = async (req, res) => {
  try {
    const conversation = await renameConversation(
      req.user.id,
      req.params.id,
      req.body.title
    );

    res.json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not rename conversation");
  }
};

export const moveConversationHandler = async (req, res) => {
  try {
    const conversation = await moveConversationToSubject(
      req.user.id,
      req.params.id,
      req.body.subject
    );

    res.json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not move conversation");
  }
};

export const deleteConversationHandler = async (req, res) => {
  try {
    await deleteConversation(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    handleError(res, error, "Could not delete conversation");
  }
};

export const postMessage = async (req, res) => {
  try {
    const conversation = await sendMessage(
      req.user.id,
      req.params.id,
      req.body.content
    );

    logActivity(req.user.id, "chat");

    res.json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not send message");
  }
};

export const regenerateHandler = async (req, res) => {
  try {
    const conversation = await regenerateLastResponse(
      req.user.id,
      req.params.id
    );

    logActivity(req.user.id, "chat");

    res.json({ success: true, conversation });
  } catch (error) {
    handleError(res, error, "Could not regenerate response");
  }
};
