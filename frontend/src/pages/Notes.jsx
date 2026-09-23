import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import client from "../api/client.js";
import ItemSidebar from "../components/ItemSidebar.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import ExportButton from "../components/ExportButton.jsx";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = notes.find((n) => n.id === activeId) || null;

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoadingList(true);
    try {
      const res = await client.get("/study/notes");
      setNotes(res.data.notes);
      if (res.data.notes.length) {
        setActiveId(res.data.notes[0].id);
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
      const res = await client.post("/study/notes", { topic, difficulty });
      setNotes([res.data.note, ...notes]);
      setActiveId(res.data.note.id);
      setShowForm(false);
      setTopic("");
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ItemSidebar
        items={notes}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setShowForm(false);
        }}
        onCreateNew={() => setShowForm(true)}
        accentClass="bg-[#D34F63]/10 text-[#D34F63]"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        label="Saved notes"
      />

      <div className="flex-1 overflow-y-auto thin-scroll bg-brand-gradient-soft min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-display font-extrabold text-accent-burgundy">📝 Study Notes</h1>
              <p className="text-gray-500 mt-1">Generate concise notes on any topic.</p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 border border-brand-200 rounded-xl px-3 py-1.5 shrink-0"
            >
              📂 {notes.length ? `${notes.length} saved` : "History"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleGenerate} className="bg-white border border-gray-100 rounded-2xl p-4 mt-6 space-y-3 animate-pop-in">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary search trees"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                <button
                  type="submit"
                  disabled={generating || !topic.trim()}
                  className="bg-brand-gradient hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-4 py-2 shadow-glow transition"
                >
                  {generating ? "Generating..." : "Generate notes"}
                </button>
              </div>
            </form>
          )}

          <ErrorBanner message={error} onRetry={handleGenerate} />
          {generating && <LoadingSpinner label="Writing your notes..." />}

          <div className="mt-6">
            {loadingList ? (
              <LoadingSpinner />
            ) : active ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pop-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">
                    {active.topic}{" "}
                    <span className="text-xs font-normal text-gray-400">({active.difficulty})</span>
                  </h3>
                  <ExportButton
                    filename={`${active.topic.replace(/\s+/g, "_")}_notes.md`}
                    content={active.content}
                    label="Export"
                  />
                </div>
                <div className="prose prose-sm max-w-none mt-3">
                  <ReactMarkdown>{active.content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              !showForm && (
                <p className="text-sm text-gray-400 text-center mt-10">
                  No notes yet — click "+ New" to generate your first one.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
