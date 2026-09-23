import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

const FEATURES = [
  { icon: "🤖", label: "AI-powered learning" },
  { icon: "🎯", label: "Personalized study support" },
  { icon: "❓", label: "Interactive quizzes" },
  { icon: "🗓️", label: "Organized study planning" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-glow-lg border border-white/40">
        {/* Left — branding panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-brand-gradient-wide text-white p-9 overflow-hidden">
          <div className="absolute -top-14 -left-14 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 dot-texture opacity-20" />

          <div className="relative">
            <div className="flex items-center gap-2 font-display font-extrabold text-xl">
              <span className="text-2xl">📚</span> Study Assistant
            </div>
            <h2 className="font-display text-3xl font-bold mt-8 leading-snug">
              Your personalized AI study space.
            </h2>
            <p className="text-white/80 mt-3 text-sm leading-relaxed">
              Chat with an AI tutor, generate notes, quiz yourself, and plan
              your study days — all in one warm, focused place.
            </p>
          </div>

          <ul className="relative space-y-3 mt-8">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/15 shrink-0">
                  {f.icon}
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — login form */}
        <div className="bg-white p-7 sm:p-10 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 font-display font-extrabold text-lg mb-6">
            <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-brand-gradient text-white shadow-glow">📚</span>
            <span className="gradient-text">Study Assistant</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-accent-burgundy">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Log in to keep studying.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <ErrorBanner message={error} />

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-brand-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-brand-200/60 rounded-xl px-3 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-brand-600 text-sm"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gradient hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm shadow-glow transition"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              No account?{" "}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
