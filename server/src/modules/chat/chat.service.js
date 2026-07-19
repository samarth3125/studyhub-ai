import { groq } from "../ai/ai.service.js";

export const askAI = async (note, question) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

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