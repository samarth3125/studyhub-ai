import { useState } from "react";
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
      alert("Demo failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-24 px-8">

      <div className="text-center">

        <h2 className="text-5xl font-bold">
          Try StudyHub AI
        </h2>

        <p className="text-gray-400 mt-4">
          Experience AI summarization instantly without creating an account.
        </p>

      </div>

      <div className="bg-slate-900 mt-12 rounded-3xl p-8 border border-slate-800">

        <textarea
          rows={8}
          value={text}
          onChange={(e)=>setText(e.target.value)}
          className="w-full bg-slate-800 rounded-xl p-5 outline-none border border-slate-700 focus:border-indigo-500"
        />

        <button
          onClick={handleDemo}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Generating..." : "✨ Generate AI Summary"}
        </button>

        {summary && (
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-green-500/30">

            <h3 className="text-green-400 font-bold mb-4">
              AI Summary
            </h3>

            <p className="whitespace-pre-wrap text-gray-300">
              {summary}
            </p>

          </div>
        )}

      </div>

    </section>
  );
};

export default AIDemo;