import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const CARDS = [
  {
    to: "/chat",
    emoji: "💬",
    title: "AI Chat",
    desc: "Ask questions and learn with your AI study assistant.",
    gradient: "from-[#45418F] to-[#8B639D]",
  },
  {
    to: "/notes",
    emoji: "📝",
    title: "Notes",
    desc: "Create and organize your study notes.",
    gradient: "from-[#D34F63] to-[#F3A6A8]",
  },
  {
    to: "/quiz",
    emoji: "❓",
    title: "Quiz",
    desc: "Test your knowledge and identify what to improve.",
    gradient: "from-[#B276A1] to-[#8B639D]",
  },
  {
    to: "/study-plan",
    emoji: "🗓️",
    title: "Study Plan",
    desc: "Organize your learning and stay on track.",
    gradient: "from-[#8F0028] to-[#D34F63]",
  },
];

const STAT_META = [
  { key: "conversations", label: "Conversations", emoji: "💬", accent: "text-[#45418F]", bg: "bg-[#45418F]/10" },
  { key: "notes", label: "Notes", emoji: "📝", accent: "text-[#D34F63]", bg: "bg-[#D34F63]/10" },
  { key: "quizzes", label: "Quizzes", emoji: "❓", accent: "text-[#8B639D]", bg: "bg-[#8B639D]/10" },
  { key: "plans", label: "Study Plans", emoji: "🗓️", accent: "text-[#8F0028]", bg: "bg-[#8F0028]/10" },
];

const QUOTES = [
  "The expert in anything was once a beginner.",
  "Small steps every day beat big leaps once a year.",
  "Study smarter, not just harder — that's what I'm here for.",
  "Consistency beats intensity. Show up today.",
  "Every topic you learn compounds into the next one.",
];

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => {
    loadOverview();
  }, []);

  async function loadOverview() {
    setLoading(true);
    try {
      const [conversations, notes, quizzes, plans] = await Promise.all([
        client.get("/chat/conversations"),
        client.get("/study/notes"),
        client.get("/study/quizzes"),
        client.get("/study/study-plans"),
      ]);

      setStats({
        conversations: conversations.data.conversations.length,
        notes: notes.data.notes.length,
        quizzes: quizzes.data.quizzes.length,
        plans: plans.data.studyPlans.length,
      });

      const feed = [
        ...conversations.data.conversations.map((c) => ({
          id: `c-${c.id}`,
          label: c.title || "New conversation",
          type: "Chat",
          emoji: "💬",
          date: c.updatedAt,
        })),
        ...notes.data.notes.map((n) => ({
          id: `n-${n.id}`,
          label: n.topic,
          type: "Notes",
          emoji: "📝",
          date: n.createdAt,
        })),
        ...quizzes.data.quizzes.map((q) => ({
          id: `q-${q.id}`,
          label: q.topic,
          type: "Quiz",
          emoji: "❓",
          date: q.createdAt,
        })),
        ...plans.data.studyPlans.map((p) => ({
          id: `p-${p.id}`,
          label: p.topic,
          type: "Study Plan",
          emoji: "🗓️",
          date: p.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

      setActivity(feed);
    } catch {
      // Non-critical — dashboard still works fine without stats.
    } finally {
      setLoading(false);
    }
  }

  const totalItems = stats
    ? stats.conversations + stats.notes + stats.quizzes + stats.plans
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-gradient-wide rounded-3xl p-7 sm:p-10 text-white shadow-glow-lg">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 dot-texture opacity-10" />
        <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-6 items-center">
          <div>
            <p className="text-white/70 text-sm font-semibold tracking-wide uppercase">
              Ready to learn something new?
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">
              Hi {user?.name} 👋
            </h1>
            <p className="text-white/85 mt-2 max-w-xl">
              Your personalized study space is ready. {quote}
            </p>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold text-sm rounded-xl px-5 py-2.5 mt-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              💬 Start a chat
            </Link>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {STAT_META.map((s) => (
              <div
                key={s.key}
                className="bg-white/12 border border-white/20 rounded-2xl p-4 backdrop-blur-sm"
              >
                <div className="text-lg">{s.emoji}</div>
                <div className="text-2xl font-display font-extrabold mt-1">
                  {loading || !stats ? "–" : stats[s.key]}
                </div>
                <div className="text-xs text-white/75">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-8">
          <LoadingSpinner label="Loading your dashboard..." />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mt-8 items-start">
        {/* Feature cards */}
        <div>
          <h2 className="font-display font-bold text-accent-burgundy text-lg mb-3">Study tools</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {CARDS.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative overflow-hidden bg-white border border-brand-100 rounded-2xl p-6 hover:shadow-glow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 group-hover:opacity-20 transition`}
                />
                <div
                  className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${c.gradient} text-2xl shadow-sm`}
                >
                  {c.emoji}
                </div>
                <h2 className="font-display font-bold text-gray-800 mt-4 text-lg">{c.title}</h2>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{c.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 mt-3 opacity-0 group-hover:opacity-100 transition">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="font-display font-bold text-accent-burgundy text-lg mb-3">Recent activity</h2>
          {!loading && activity.length > 0 ? (
            <div className="bg-white border border-brand-100 rounded-2xl divide-y divide-brand-50 shadow-card">
              {activity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-50 text-base shrink-0">
                    {a.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{a.label}</p>
                    <p className="text-xs text-gray-400">{a.type}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(a.date)}</span>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="bg-white border border-brand-100 rounded-2xl p-6 text-center shadow-card">
                <p className="text-sm text-gray-400">
                  Nothing generated yet — pick a tool to get started! ✨
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
