import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, UploadCloud, CheckCircle2, Sparkles, Copy } from "lucide-react";
import { uploadPDF } from "../api/pdf";
import { summarizeNote } from "../api/ai";
import Button from "./ui/Button";

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const res = await uploadPDF(file);

      setText(res.text);
      setSummary("");
      toast.success("PDF processed successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "PDF upload failed");
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
      toast.error("Summary generation failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
          <FileText size={18} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            PDF Study Assistant
          </h2>
          <p className="text-slate-500 text-sm">
            Upload a PDF to extract and summarize its text.
          </p>
        </div>
      </div>

      <label className="block">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files[0];
            if (selected) setFile(selected);
          }}
        />

        <div className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-8 text-center transition-colors">
          <UploadCloud size={28} className="mx-auto text-indigo-400 mb-3" />

          <p className="text-slate-200 font-medium">Click to choose a PDF</p>
          <p className="text-slate-500 text-sm mt-1">PDF only • Max 10 MB</p>
        </div>
      </label>

      {file && (
        <div className="mt-4 bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-slate-200 text-sm font-medium truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      <Button
        fullWidth
        className="mt-5"
        icon={UploadCloud}
        loading={loading}
        onClick={handleUpload}
      >
        Upload PDF
      </Button>

      {text && (
        <>
          <div className="mt-6 bg-slate-950/60 border border-slate-800 rounded-xl p-5 max-h-72 overflow-y-auto">
            <h3 className="font-semibold text-slate-200 mb-3 text-sm">
              Extracted Text
            </h3>

            <p className="text-slate-400 whitespace-pre-wrap leading-7 text-sm">
              {text}
            </p>
          </div>

          <Button
            fullWidth
            variant="success"
            className="mt-4"
            icon={Sparkles}
            loading={summaryLoading}
            onClick={handleSummary}
          >
            Summarize PDF
          </Button>
        </>
      )}

      {summary && (
        <div className="mt-6 bg-slate-950/60 border border-emerald-500/30 rounded-xl p-5">
          <div className="flex justify-between items-center">
            <h3 className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
              <Sparkles size={14} />
              AI Summary
            </h3>

            <button
              onClick={() => {
                navigator.clipboard.writeText(summary);
                toast.success("Copied to clipboard");
              }}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
            >
              <Copy size={14} />
            </button>
          </div>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300 text-sm">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
