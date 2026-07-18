import { groq } from "../ai/ai.service.js";

export const generateQuiz = async (content) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
Generate exactly 5 multiple choice questions.

Return ONLY valid JSON.

Format:

[
  {
    "question":"...",
    "options":["A","B","C","D"],
    "answer":"..."
  }
]

No markdown.
No explanation.
Only JSON.
`,
      },
      {
        role: "user",
        content,
      },
    ],

    temperature: 0.4,
    max_tokens: 1200,
  });

  return JSON.parse(
    completion.choices[0].message.content
  );
};