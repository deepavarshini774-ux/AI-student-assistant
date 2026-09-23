import { useState } from "react";
import confetti from "canvas-confetti";

export default function QuizCard({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const percent = Math.round((score / questions.length) * 100);

  function handleSubmit() {
    setSubmitted(true);
    const finalScore = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    // Celebrate a strong score with a burst of confetti — small, tasteful,
    // and skipped entirely for a low score so it never feels mocking.
    if (finalScore / questions.length >= 0.6) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8F0028", "#D34F63", "#B276A1", "#45418F"],
      });
    }
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3">
            {i + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => {
              const isSelected = answers[i] === optIndex;
              const isCorrect = submitted && optIndex === q.correctIndex;
              const isWrongSelected = submitted && isSelected && optIndex !== q.correctIndex;

              return (
                <button
                  key={optIndex}
                  disabled={submitted}
                  onClick={() => setAnswers({ ...answers, [i]: optIndex })}
                  className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition
                    ${isSelected && !submitted ? "border-brand-400 bg-brand-50" : "border-gray-200"}
                    ${isCorrect ? "border-emerald-400 bg-emerald-50" : ""}
                    ${isWrongSelected ? "border-rose-400 bg-rose-50" : ""}
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="text-xs text-gray-500 mt-2">💡 {q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-xl px-4 py-2 shadow-glow transition"
        >
          Submit answers
        </button>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-center justify-between animate-pop-in">
          <div>
            <p className="font-bold text-gray-800">
              Score: {score} / {questions.length}
            </p>
            <p className="text-sm text-gray-500">
              {percent >= 80 ? "Excellent work! 🎉" : percent >= 60 ? "Nice job! 👍" : "Keep practicing 💪"}
            </p>
          </div>
          <div className="text-3xl font-extrabold gradient-text">{percent}%</div>
        </div>
      )}
    </div>
  );
}
