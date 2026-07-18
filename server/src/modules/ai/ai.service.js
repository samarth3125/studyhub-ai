import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const summarizeNote = async (content) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
You are an expert study assistant.

Summarize the user's notes using these rules:
- Maximum 5 bullet points.
- Keep each bullet under 15 words.
- Remove unnecessary explanations.
- Highlight only key concepts.
- Return ONLY bullet points.
`,
      },
      {
        role: "user",
        content,
      },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
};