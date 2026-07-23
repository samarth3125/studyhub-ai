import { groq } from "../ai/ai.service.js";

const MODEL = "llama-3.3-70b-versatile";

export const MODES = {
  explain: "Explain",
  simplify: "Simplify",
  example: "Generate Examples",
  mnemonic: "Generate a Mnemonic",
  analogy: "Generate an Analogy",
  beginner: "Explain for Beginners",
  exam: "Explain for Exams",
};

const SYSTEM_PROMPT = `
You are Mind Space, the concept-explanation engine inside StudyHub AI.

Format every response in clean Markdown, structured as level-2 headings
("## Heading") so it can be rendered as distinct sections. Rules:
- Use short paragraphs and bold key terms inside each section.
- Use bullet or numbered lists where they aid clarity.
- Never start with filler like "Sure, here is..." — start directly with
  the first "##" heading.
- Only include the headings listed for the current mode, in the order
  given, and always end with a "## Related Topics" section listing 3-5
  related concepts as a short bullet list.
- Keep each section focused and study-friendly.
`;

const SECTIONS_BY_MODE = {
  explain: ["Definition", "Key Points", "Examples", "Related Topics"],
  simplify: ["Simple Definition", "Key Points", "Related Topics"],
  example: ["Overview", "Examples", "Related Topics"],
  mnemonic: ["Mnemonic", "How It Maps", "Related Topics"],
  analogy: ["Analogy", "How It Maps", "Related Topics"],
  beginner: ["Definition", "Key Points", "Examples", "Related Topics"],
  exam: ["Definition", "Key Points", "Exam Answer", "Related Topics"],
};

const buildPrompt = (mode, concept, subjectName) => {
  const context = subjectName ? ` (in the context of ${subjectName})` : "";
  const headings = SECTIONS_BY_MODE[mode];
  const headingList = headings.map((h) => `## ${h}`).join(", ");
  const structureNote = `Structure the response using exactly these headings, in order: ${headingList}.`;

  switch (mode) {
    case "explain":
      return `Explain the concept of "${concept}"${context} clearly and thoroughly, covering what it is, why it matters, and how it works. ${structureNote}`;
    case "simplify":
      return `Simplify the concept of "${concept}"${context} into plain, everyday language a beginner could understand in under a minute. ${structureNote}`;
    case "example":
      return `Give 3 clear, concrete, real-world examples that illustrate "${concept}"${context}. Number them and briefly explain each. ${structureNote}`;
    case "mnemonic":
      return `Create a memorable mnemonic device (acronym, rhyme, or phrase) to help remember "${concept}"${context}, and briefly explain how it maps to the concept. ${structureNote}`;
    case "analogy":
      return `Create a vivid, relatable analogy that explains "${concept}"${context} by comparing it to something familiar from everyday life. Explain how the analogy maps to the real concept. ${structureNote}`;
    case "beginner":
      return `Explain "${concept}"${context} for a complete beginner with zero background knowledge. Avoid jargon, or define any term you must use. ${structureNote}`;
    case "exam":
      return `Explain "${concept}"${context} in exam-answer style: precise, well-structured, using the key terminology an examiner would expect, suitable for direct revision. ${structureNote}`;
    default: {
      const err = new Error("Invalid Mind Space mode");
      err.status = 400;
      throw err;
    }
  }
};

export const generateMindSpaceResponse = async (mode, concept, subjectName) => {
  if (!MODES[mode]) {
    const err = new Error("Invalid Mind Space mode");
    err.status = 400;
    throw err;
  }

  const prompt = buildPrompt(mode, concept, subjectName);

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 800,
  });

  return completion.choices[0].message.content;
};
