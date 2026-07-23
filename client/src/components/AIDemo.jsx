import { useState } from "react";
import toast from "react-hot-toast";
import { Sparkles, Wand2 } from "lucide-react";
import { summarizeNote } from "../api/ai";

const sampleText = `Machine Learning is a branch of Artificial Intelligence.
It allows computers to learn from data without being explicitly programmed.
There are three major types:
Supervised Learning,
Unsupervised Learning,
and Reinforcement Learning.`;

const AIDemo = () => {
  const [text, setText] = useState(sampleText);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDemo = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await summarizeNote(text);

      setSummary(res.summary);
    } catch (err) {
      console.error(err);
      toast.error(
        "Try this from a logged-in dashboard note — the live demo needs an account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-24 px-6 sm:px-8">
      <div className="text-center">
        <p className="text-indigo-400 font-semibold text-sm tracking-wide">
          TRY IT OUT
        </p>

        <h2 className="text-4xl sm:text-5xl font-bold mt-4 tracking-tight">
          Try StudyHub AI
        </h2>

        <p className="text-slate-400 mt-4 text-lg">
          See how AI summarization works on a sample note.
        </p>
      </div>

      <div className="bg-slate-900/60 mt-12 rounded-2xl p-6 sm:p-8 border border-slate-800 backdrop-blur-sm">
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-slate-950/60 rounded-xl p-5 outline-none border border-slate-800 focus:border-indigo-500 text-slate-200 resize-none"
        />

        <button
          onClick={handleDemo}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-7 py-3 rounded-xl font-semibold transition-colors"
        >
          <Wand2 size={16} />
          {loading ? "Generating..." : "Generate AI Summary"}
        </button>

        {summary && (
          <div className="mt-8 bg-slate-950/60 rounded-xl p-6 border border-emerald-500/30">
            <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2 text-sm">
              <Sparkles size={14} />
              AI Summary
            </h3>

            <p className="whitespace-pre-wrap text-slate-300 text-sm leading-7">
              {summary}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIDemo;
