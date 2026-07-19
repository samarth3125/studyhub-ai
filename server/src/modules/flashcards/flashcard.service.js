import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateFlashcards = async (content) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: 900,

    messages: [
      {
        role: "system",
        content: `
You are an expert study assistant.

Generate exactly 10 flashcards.

Return ONLY valid JSON.

Format:

{
  "cards":[
    {
      "question":"...",
      "answer":"..."
    }
  ]
}

No markdown.
No explanation.
No extra text.
`,
      },
      {
        role: "user",
        content,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
};