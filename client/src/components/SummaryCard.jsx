const SummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-green-400 mb-4">
        ✨ AI Summary
      </h2>

      <p className="text-gray-300 whitespace-pre-line leading-7">
        {summary}
      </p>
    </div>
  );
};

export default SummaryCard;