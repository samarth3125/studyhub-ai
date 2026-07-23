import { useState } from "react";
import toast from "react-hot-toast";
import { MessageSquare, Copy, Send } from "lucide-react";
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
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 bg-slate-950/60 border border-cyan-500/30 rounded-xl p-5">
      <h3 className="text-cyan-400 font-semibold text-sm flex items-center gap-1.5 mb-4">
        <MessageSquare size={14} />
        AI Study Assistant
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleAsk(prompt)}
            disabled={loading}
            className="bg-slate-800 hover:bg-cyan-600/80 disabled:opacity-50 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask anything about this note..."
        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 text-sm outline-none focus:border-cyan-500 resize-none placeholder:text-slate-500"
      />

      <button
        onClick={() => handleAsk()}
        disabled={loading}
        className="mt-3 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
      >
        <Send size={14} />
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-5 bg-slate-900/80 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-cyan-400 text-sm">
              AI Response
            </h4>

            <button
              onClick={() => {
                navigator.clipboard.writeText(answer);
                toast.success("Copied to clipboard");
              }}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
            >
              <Copy size={13} />
            </button>
          </div>

          <p className="whitespace-pre-wrap leading-7 text-slate-300 text-sm">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIChat;
