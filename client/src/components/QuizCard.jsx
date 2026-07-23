import { useState } from "react";
import { Brain, RotateCcw, PartyPopper } from "lucide-react";

const QuizCard = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) return null;

  const question = questions[current];

  const chooseOption = (option) => {
    if (submitted) return;

    setSelected((prev) => ({ ...prev, [current]: option }));
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
  };

  const previousQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const submitQuiz = () => {
    let marks = 0;

    questions.forEach((q, index) => {
      if (selected[index] === q.answer) marks++;
    });

    setScore(marks);
    setSubmitted(true);
  };

  const retryQuiz = () => {
    setSelected({});
    setCurrent(0);
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="mt-5 bg-slate-950/60 border border-purple-500/30 rounded-xl p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-purple-400 font-semibold text-sm flex items-center gap-1.5">
          <Brain size={14} />
          AI Quiz
        </h2>

        <span className="text-xs text-slate-500">
          Question {current + 1} / {questions.length}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-base font-medium text-slate-100 mb-4">
          {question.question}
        </h3>

        <div className="space-y-2.5">
          {question.options.map((option, index) => {
            const isSelected = selected[current] === option;

            let bg = "bg-slate-800 hover:bg-slate-700 border-slate-700";

            if (submitted) {
              if (option === question.answer)
                bg = "bg-emerald-600/80 border-emerald-500";
              else if (isSelected) bg = "bg-red-600/80 border-red-500";
              else bg = "bg-slate-800 border-slate-700 opacity-60";
            } else if (isSelected) {
              bg = "bg-indigo-600/80 border-indigo-500";
            }

            return (
              <button
                key={index}
                onClick={() => chooseOption(option)}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${bg}`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={current === 0}
          onClick={previousQuestion}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-4 py-2 rounded-lg text-sm transition-colors"
        >
          ← Previous
        </button>

        {current < questions.length - 1 ? (
          <button
            onClick={nextQuestion}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Next →
          </button>
        ) : !submitted ? (
          <button
            onClick={submitQuiz}
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={retryQuiz}
            className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-900 hover:bg-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw size={13} />
            Retry Quiz
          </button>
        )}
      </div>

      {submitted && (
        <div className="mt-6 text-center bg-slate-900/80 rounded-xl p-6">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
            <PartyPopper size={20} className="text-emerald-400" />
          </div>

          <h3 className="text-lg font-semibold text-slate-100">
            Quiz Completed
          </h3>

          <p className="text-4xl font-bold mt-3 text-slate-50">
            {score} / {questions.length}
          </p>

          <p className="mt-2 text-slate-400 text-sm">
            {Math.round((score / questions.length) * 100)}% correct
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
