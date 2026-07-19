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
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex flex-col justify-center items-center p-6 shadow-xl">
          <p className="text-sm uppercase tracking-widest opacity-80">
            Question
          </p>

          <h2 className="text-xl font-bold text-center mt-4">
            {question}
          </h2>

          <p className="text-sm opacity-70 mt-8">
            Click to reveal answer
          </p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col justify-center items-center p-6 shadow-xl">
          <p className="text-sm uppercase tracking-widest opacity-80">
            Answer
          </p>

          <h2 className="text-xl font-bold text-center mt-4">
            {answer}
          </h2>

          <p className="text-sm opacity-70 mt-8">
            Click to flip back
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;