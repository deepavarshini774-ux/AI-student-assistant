import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/chat", label: "Chat" },
  { to: "/notes", label: "Notes" },
  { to: "/quiz", label: "Quiz" },
  { to: "/study-plan", label: "Study Plan" },
];

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-xl text-sm font-semibold transition ${
    isActive
      ? "bg-brand-gradient text-white shadow-glow"
      : "text-accent-burgundy/70 hover:bg-brand-100 hover:text-brand-600"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
    isActive
      ? "bg-brand-gradient text-white shadow-glow"
      : "text-accent-burgundy/70 hover:bg-brand-100"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-20 bg-[#FFF9F3]/85 backdrop-blur border-b border-brand-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-display font-extrabold text-lg shrink-0">
          <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-brand-gradient text-white text-base shadow-glow animate-float">
            📚
          </span>
          <span className="gradient-text">Study Assistant</span>
        </NavLink>

        {user && (
          <>
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-gradient text-white text-xs font-bold ml-2 shrink-0">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-brand-300 hover:bg-brand-100 hover:text-brand-600 transition"
              >
                Log out
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl border border-brand-200/60 text-brand-600"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div className="md:hidden border-t border-brand-200/40 bg-[#FFF9F3]/95 backdrop-blur px-4 py-3 space-y-1 animate-fade-up">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={mobileLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3 pt-2 mt-2 border-t border-brand-200/40">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-gradient text-white text-xs font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="text-sm font-medium text-accent-burgundy/70 truncate flex-1">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-100 transition"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
