import { useEffect, useState } from "react";
import client from "../api/client.js";
import ItemSidebar from "../components/ItemSidebar.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import ExportButton from "../components/ExportButton.jsx";

export default function StudyPlan() {
  const [plans, setPlans] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [goalDays, setGoalDays] = useState(7);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = plans.find((p) => p.id === activeId) || null;

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    setLoadingList(true);
    try {
      const res = await client.get("/study/study-plans");
      setPlans(res.data.studyPlans);
      if (res.data.studyPlans.length) {
        setActiveId(res.data.studyPlans[0].id);
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
      const res = await client.post("/study/study-plans", { topic, difficulty, goalDays });
      setPlans([res.data.studyPlan, ...plans]);
      setActiveId(res.data.studyPlan.id);
      setShowForm(false);
      setTopic("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const exportText = active
    ? active.content.days
        .map(
          (d) =>
            `Day ${d.day}: ${d.title}\n` +
            `Objectives:\n${d.objectives.map((o) => `  - ${o}`).join("\n")}\n` +
            `Activities:\n${d.activities.map((a) => `  - ${a}`).join("\n")}\n` +
            `Estimated time: ${d.estimatedMinutes} min\n`
        )
        .join("\n")
    : "";

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ItemSidebar
        items={plans}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setShowForm(false);
        }}
        onCreateNew={() => setShowForm(true)}
        accentClass="bg-[#8F0028]/10 text-[#8F0028]"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        label="Saved plans"
      />

      <div className="flex-1 overflow-y-auto thin-scroll bg-brand-gradient-soft min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-display font-extrabold text-accent-burgundy">🗓️ Personalized Study Plan</h1>
              <p className="text-gray-500 mt-1">Get a day-by-day plan tailored to your level.</p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 border border-brand-200 rounded-xl px-3 py-1.5 shrink-0"
            >
              📂 {plans.length ? `${plans.length} saved` : "History"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleGenerate} className="bg-white border border-gray-100 rounded-2xl p-4 mt-6 space-y-3 animate-pop-in">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Linear Algebra fundamentals"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Days</label>
                  <input
                    type="number"
                    min={3}
                    max={30}
                    value={goalDays}
                    onChange={(e) => setGoalDays(Number(e.target.value))}
                    className="w-16 border border-gray-200 rounded-xl px-2 py-1 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={generating || !topic.trim()}
                  className="bg-brand-gradient hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-4 py-2 shadow-glow transition"
                >
                  {generating ? "Generating..." : "Generate plan"}
                </button>
              </div>
            </form>
          )}

          <ErrorBanner message={error} onRetry={handleGenerate} />
          {generating && <LoadingSpinner label="Building your plan..." />}

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
                    filename={`${active.topic.replace(/\s+/g, "_")}_study_plan.txt`}
                    content={exportText}
                    label="Export"
                  />
                </div>
                {active.content.days.map((d) => (
                  <div key={d.day} className="bg-white border border-gray-100 rounded-2xl p-4">
                    <h3 className="font-bold text-brand-700">
                      Day {d.day}: {d.title}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        (~{d.estimatedMinutes} min)
                      </span>
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3 mt-2 text-sm">
                      <div>
                        <p className="font-semibold text-gray-600">Objectives</p>
                        <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                          {d.objectives.map((o, i) => <li key={i}>{o}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600">Activities</p>
                        <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                          {d.activities.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showForm && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No study plans yet — click "+ New" to generate your first one.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
