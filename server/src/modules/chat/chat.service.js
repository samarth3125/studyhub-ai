import { groq } from "../ai/ai.service.js";
import Conversation from "./conversation.model.js";

const MODEL = "llama-3.3-70b-versatile";

// ---------------------------------------------------------------------
// EXISTING FEATURE — do not remove. Powers the "Ask AI about this note"
// panel on the Notes page (components/AIChat.jsx -> POST /api/chat).
// ---------------------------------------------------------------------
export const askAI = async (note, question) => {
  const completion = await groq.chat.completions.create({
    model: MODEL,

    messages: [
      {
        role: "system",
        content: `
You are an expert AI study assistant.

Answer ONLY using the provided note.

Rules:
- If the answer exists in the note, answer clearly.
- If the answer is partially available, explain only that part.
- If the answer is NOT in the note, reply:
"The provided note does not contain enough information to answer this question."

Keep responses easy to understand.
`,
      },
      {
        role: "user",
        content: `
NOTE:

${note}

--------------------------------

QUESTION:

${question}
`,
      },
    ],

    temperature: 0.5,
    max_tokens: 700,
  });

  return completion.choices[0].message.content;
};

// ---------------------------------------------------------------------
// NEW — AI Workspace: persistent, multi-turn, multi-conversation chat.
// ---------------------------------------------------------------------

const WORKSPACE_SYSTEM_PROMPT = `
You are the AI assistant inside StudyHub AI's Workspace — a general-purpose
study companion (distinct from the note-specific Q&A tool).

Rules:
- Be clear, accurate, and helpful for a student audience.
- Use Markdown formatting: headings where useful, bold for key terms,
  bullet or numbered lists for steps, and code blocks for code.
- Keep answers focused — avoid unnecessary preamble like "Sure, here is...".
- If a question is ambiguous, make a reasonable assumption and answer it,
  briefly noting the assumption.
`;

const HISTORY_WINDOW = 20; // cap how many past messages are sent to the model

const deriveTitle = (text = "") => {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "New Chat";
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean;
};

const notFound = (message = "Conversation not found") => {
  const err = new Error(message);
  err.status = 404;
  return err;
};

export const createConversation = async (userId, { subject, title } = {}) => {
  const conversation = await Conversation.create({
    user: userId,
    subject: subject || null,
    title: title ? deriveTitle(title) : "New Chat",
    messages: [],
  });

  return conversation;
};

export const listConversations = async (userId, { search, subject } = {}) => {
  const query = { user: userId };

  if (subject) query.subject = subject;
  if (search?.trim()) {
    query.title = { $regex: search.trim(), $options: "i" };
  }

  const conversations = await Conversation.find(query)
    .populate("subject", "name")
    .sort({ updatedAt: -1 })
    .lean();

  return conversations.map((c) => {
    const last = c.messages?.[c.messages.length - 1];
    return {
      _id: c._id,
      title: c.title,
      subject: c.subject,
      updatedAt: c.updatedAt,
      createdAt: c.createdAt,
      messageCount: c.messages?.length || 0,
      lastMessagePreview: last
        ? `${last.role === "user" ? "You: " : ""}${last.content.slice(0, 90)}`
        : "",
    };
  });
};

export const getConversation = async (userId, id) => {
  const conversation = await Conversation.findOne({
    _id: id,
    user: userId,
  }).populate("subject", "name");

  if (!conversation) throw notFound();

  return conversation;
};

export const renameConversation = async (userId, id, title) => {
  if (!title?.trim()) {
    const err = new Error("Title cannot be empty");
    err.status = 400;
    throw err;
  }

  const conversation = await Conversation.findOneAndUpdate(
    { _id: id, user: userId },
    { title: title.trim().slice(0, 80) },
    { new: true }
  );

  if (!conversation) throw notFound();

  return conversation;
};

export const moveConversationToSubject = async (userId, id, subjectId) => {
  const conversation = await Conversation.findOneAndUpdate(
    { _id: id, user: userId },
    { subject: subjectId || null },
    { new: true }
  ).populate("subject", "name");

  if (!conversation) throw notFound();

  return conversation;
};

export const deleteConversation = async (userId, id) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!conversation) throw notFound();

  return conversation;
};

export const sendMessage = async (userId, id, content) => {
  if (!content?.trim()) {
    const err = new Error("Message content is required");
    err.status = 400;
    throw err;
  }

  const conversation = await Conversation.findOne({ _id: id, user: userId });
  if (!conversation) throw notFound();

  const isFirstMessage = conversation.messages.length === 0;

  conversation.messages.push({ role: "user", content: content.trim() });

  const history = conversation.messages
    .slice(-HISTORY_WINDOW)
    .map((m) => ({ role: m.role, content: m.content }));

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: WORKSPACE_SYSTEM_PROMPT },
      ...history,
    ],
    temperature: 0.6,
    max_tokens: 900,
  });

  const reply = completion.choices[0].message.content;
  conversation.messages.push({ role: "assistant", content: reply });

  if (isFirstMessage) {
    conversation.title = deriveTitle(content);
  }

  await conversation.save();

  return conversation;
};

export const regenerateLastResponse = async (userId, id) => {
  const conversation = await Conversation.findOne({ _id: id, user: userId });
  if (!conversation) throw notFound();

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  if (!lastMessage || lastMessage.role !== "assistant") {
    const err = new Error("There is no AI response to regenerate yet");
    err.status = 400;
    throw err;
  }

  conversation.messages.pop();

  const history = conversation.messages
    .slice(-HISTORY_WINDOW)
    .map((m) => ({ role: m.role, content: m.content }));

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: WORKSPACE_SYSTEM_PROMPT },
      ...history,
    ],
    temperature: 0.85,
    max_tokens: 900,
  });

  const reply = completion.choices[0].message.content;
  conversation.messages.push({ role: "assistant", content: reply });

  await conversation.save();

  return conversation;
};
