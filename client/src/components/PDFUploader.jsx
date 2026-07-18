import { useState } from "react";
import { uploadPDF } from "../api/pdf";
import { summarizeNote } from "../api/ai";

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleUpload = async () => {
    console.log("Current File:", file);

    if (!file) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const res = await uploadPDF(file);

      console.log(res);

      setText(res.text);
      setSummary("");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "PDF Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    try {
      setSummaryLoading(true);

      const res = await summarizeNote(text);

      setSummary(res.summary);
    } catch (err) {
      console.error(err);
      alert("Summary generation failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg mt-10">

      <h2 className="text-3xl font-bold mb-6">
        📄 PDF Study Assistant
      </h2>

      <label className="block">

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files[0];

            console.log("Selected:", selected);

            if (selected) {
              setFile(selected);
            }
          }}
        />

        <div className="cursor-pointer border-2 border-dashed border-indigo-500 rounded-xl p-8 text-center hover:bg-slate-800 transition">

          <p className="text-xl">
            📂 Click to Choose PDF
          </p>

          <p className="text-gray-400 mt-2">
            PDF only • Max 10 MB
          </p>

        </div>

      </label>

      {file && (
        <div className="mt-5 bg-slate-800 rounded-lg p-4">

          <p className="text-green-400 font-semibold">
            ✅ Selected File
          </p>

          <p className="text-gray-300 mt-1">
            {file.name}
          </p>

          <p className="text-sm text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-3 rounded-xl font-semibold transition"
      >
        {loading ? "Uploading PDF..." : "📤 Upload PDF"}
      </button>

      {text && (
        <>
          <div className="mt-8 bg-slate-800 rounded-xl p-5 max-h-80 overflow-y-auto">

            <h3 className="text-xl font-bold mb-4">
              📖 Extracted Text
            </h3>

            <p className="text-gray-300 whitespace-pre-wrap leading-7">
              {text}
            </p>

          </div>

          <button
            onClick={handleSummary}
            disabled={summaryLoading}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-xl font-semibold"
          >
            {summaryLoading
              ? "Generating Summary..."
              : "✨ Summarize PDF"}
          </button>
        </>
      )}

      {summary && (
        <div className="mt-8 bg-slate-800 border border-green-500/30 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <h3 className="text-green-400 font-bold text-xl">
              ✨ AI Summary
            </h3>

            <button
              onClick={() =>
                navigator.clipboard.writeText(summary)
              }
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            >
              📋 Copy
            </button>

          </div>

          <p className="mt-5 whitespace-pre-wrap leading-7 text-gray-300">
            {summary}
          </p>

        </div>
      )}
    </div>
  );
};

export default PDFUploader;