import { useState } from "react";

const QuizCard = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions || questions.length === 0) return null;

  const question = questions[current];

  const chooseOption = (option) => {
    if (submitted) return;

    setSelected((prev) => ({
      ...prev,
      [current]: option,
    }));
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const submitQuiz = () => {
    let marks = 0;

    questions.forEach((q, index) => {
      if (selected[index] === q.answer) {
        marks++;
      }
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
    <div className="mt-6 bg-slate-800 border border-purple-500/30 rounded-2xl p-6">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-purple-400">
          🧠 AI Quiz
        </h2>

        <span className="text-gray-400">
          Question {current + 1} / {questions.length}
        </span>

      </div>

      <div className="mt-6">

        <h3 className="text-xl font-semibold mb-5">
          {question.question}
        </h3>

        <div className="space-y-3">

          {question.options.map((option, index) => {

            const isSelected =
              selected[current] === option;

            let bg = "bg-slate-700";

            if (submitted) {
              if (option === question.answer)
                bg = "bg-green-600";

              else if (isSelected)
                bg = "bg-red-600";
            } else if (isSelected) {
              bg = "bg-indigo-600";
            }

            return (
              <button
                key={index}
                onClick={() => chooseOption(option)}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${bg}`}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}

        </div>

      </div>

      <div className="flex justify-between mt-8">

        <button
          disabled={current === 0}
          onClick={previousQuestion}
          className="bg-slate-700 px-5 py-2 rounded-lg disabled:opacity-40"
        >
          ← Previous
        </button>

        {current < questions.length - 1 ? (

          <button
            onClick={nextQuestion}
            className="bg-indigo-600 px-5 py-2 rounded-lg"
          >
            Next →
          </button>

        ) : (

          !submitted ? (

            <button
              onClick={submitQuiz}
              className="bg-green-600 px-5 py-2 rounded-lg"
            >
              Submit Quiz
            </button>

          ) : (

            <button
              onClick={retryQuiz}
              className="bg-yellow-500 text-black px-5 py-2 rounded-lg"
            >
              Retry Quiz
            </button>

          )

        )}

      </div>

      {submitted && (

        <div className="mt-8 text-center bg-slate-900 rounded-xl p-6">

          <h3 className="text-3xl font-bold text-green-400">
            🎉 Quiz Completed
          </h3>

          <p className="text-2xl mt-3">
            Score
          </p>

          <p className="text-5xl font-bold mt-2">
            {score} / {questions.length}
          </p>

          <p className="mt-3 text-gray-400">
            {Math.round((score / questions.length) * 100)}%
          </p>

        </div>

      )}

    </div>
  );
};

export default QuizCard;