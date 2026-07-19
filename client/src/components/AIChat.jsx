import { useState } from "react";
import { askAI } from "../api/chat";

const quickPrompts = [
  "Explain this note in simple language.",
  "Generate viva questions.",
  "Generate interview questions.",
  "Give real-world examples.",
  "What are the important points?",
];

const AIChat = ({ note }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (customQuestion = question) => {
    if (!customQuestion.trim()) return;

    try {
      setLoading(true);

      const res = await askAI(note.content, customQuestion);

      setAnswer(res.answer);

      if (!question) setQuestion(customQuestion);
    } catch (err) {
      console.error(err);
      alert("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-slate-800 border border-cyan-500/30 rounded-xl p-5">

      <h3 className="text-cyan-400 font-bold text-lg mb-4">
        💬 AI Study Assistant
      </h3>

      {/* Quick Prompts */}

      <div className="flex flex-wrap gap-2 mb-4">

        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleAsk(prompt)}
            className="bg-slate-700 hover:bg-cyan-600 px-3 py-2 rounded-lg text-sm transition"
          >
            {prompt}
          </button>
        ))}

      </div>

      {/* Input */}

      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about this note..."
        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:border-cyan-500"
      />

      <button
        onClick={() => handleAsk()}
        disabled={loading}
        className="mt-4 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Thinking..." : "💬 Ask AI"}
      </button>

      {answer && (
        <div className="mt-6 bg-slate-900 rounded-xl p-5 border border-cyan-500/20">

          <div className="flex justify-between items-center mb-3">

            <h4 className="font-bold text-cyan-400">
              🤖 AI Response
            </h4>

            <button
              onClick={() => navigator.clipboard.writeText(answer)}
              className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm"
            >
              📋 Copy
            </button>

          </div>

          <p className="whitespace-pre-wrap leading-7 text-gray-300">
            {answer}
          </p>

        </div>
      )}

    </div>
  );
};

export default AIChat;