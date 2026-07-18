import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

console.log("KEY:", process.env.GROQ_API_KEY?.substring(0, 10));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

try {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Say hello in one sentence.",
      },
    ],
  });

  console.log("\n✅ SUCCESS");
  console.log(completion.choices[0].message.content);
} catch (err) {
  console.log("\n❌ ERROR");
  console.error(err);
}