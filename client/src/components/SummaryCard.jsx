import { Sparkles } from "lucide-react";

const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="mt-8 bg-slate-900/60 border border-emerald-500/30 rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
        <Sparkles size={16} />
        AI Summary
      </h2>

      <p className="text-slate-300 whitespace-pre-line leading-7 text-sm">
        {summary}
      </p>
    </div>
  );
};

export default SummaryCard;
