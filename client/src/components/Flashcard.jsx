import { useState } from "react";

const Flashcard = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-56 duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-center items-center p-6 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium">
            Question
          </p>

          <h2 className="text-lg font-semibold text-center mt-4 text-slate-100">
            {question}
          </h2>

          <p className="text-xs text-slate-500 mt-8">Click to reveal answer</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl bg-indigo-600 border border-indigo-500/50 flex flex-col justify-center items-center p-6 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-indigo-200 font-medium">
            Answer
          </p>

          <h2 className="text-lg font-semibold text-center mt-4 text-white">
            {answer}
          </h2>

          <p className="text-xs text-indigo-200/70 mt-8">Click to flip back</p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
