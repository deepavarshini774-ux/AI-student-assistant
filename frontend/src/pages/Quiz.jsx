import { useEffect, useState } from "react";
import client from "../api/client.js";
import ItemSidebar from "../components/ItemSidebar.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import ExportButton from "../components/ExportButton.jsx";
import QuizCard from "../components/QuizCard.jsx";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = quizzes.find((q) => q.id === activeId) || null;

  useEffect(() => {
    loadQuizzes();
  }, []);

  async function loadQuizzes() {
    setLoadingList(true);
    try {
      const res = await client.get("/study/quizzes");
      setQuizzes(res.data.quizzes);
      if (res.data.quizzes.length) {
        setActiveId(res.data.quizzes[0].id);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setError("");
    try {
      const res = await client.post("/study/quizzes", { topic, difficulty, count });
      setQuizzes([res.data.quiz, ...quizzes]);
      setActiveId(res.data.quiz.id);
      setShowForm(false);
      setTopic("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const exportText = active
    ? active.content.questions
        .map(
          (q, i) =>
            `${i + 1}. ${q.question}\n` +
            q.options.map((o, j) => `   ${String.fromCharCode(65 + j)}. ${o}`).join("\n") +
            `\n   Answer: ${String.fromCharCode(65 + q.correctIndex)} — ${q.explanation}\n`
        )
        .join("\n")
    : "";

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ItemSidebar
        items={quizzes}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setShowForm(false);
        }}
        onCreateNew={() => setShowForm(true)}
        accentClass="bg-[#8B639D]/10 text-[#8B639D]"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        label="Saved quizzes"
      />

      <div className="flex-1 overflow-y-auto thin-scroll bg-brand-gradient-soft min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-display font-extrabold text-accent-burgundy">❓ Quiz Generator</h1>
              <p className="text-gray-500 mt-1">Test your understanding with auto-generated MCQs.</p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 border border-brand-200 rounded-xl px-3 py-1.5 shrink-0"
            >
              📂 {quizzes.length ? `${quizzes.length} saved` : "History"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleGenerate} className="bg-white border border-gray-100 rounded-2xl p-4 mt-6 space-y-3 animate-pop-in">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600"># Questions</label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-16 border border-gray-200 rounded-xl px-2 py-1 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={generating || !topic.trim()}
                  className="bg-brand-gradient hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-4 py-2 shadow-glow transition"
                >
                  {generating ? "Generating..." : "Generate quiz"}
                </button>
              </div>
            </form>
          )}

          <ErrorBanner message={error} onRetry={handleGenerate} />
          {generating && <LoadingSpinner label="Writing quiz questions..." />}

          <div className="mt-6">
            {loadingList ? (
              <LoadingSpinner />
            ) : active ? (
              <div className="space-y-4 animate-pop-in">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800">
                    {active.topic}{" "}
                    <span className="text-xs font-normal text-gray-400">({active.difficulty})</span>
                  </h2>
                  <ExportButton
                    filename={`${active.topic.replace(/\s+/g, "_")}_quiz.txt`}
                    content={exportText}
                    label="Export"
                  />
                </div>
                <QuizCard questions={active.content.questions} />
              </div>
            ) : (
              !showForm && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No quizzes yet — click "+ New" to generate your first one.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
