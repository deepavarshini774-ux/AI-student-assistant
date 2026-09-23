/**
 * A left-hand list of previously generated items (notes, quizzes, study
 * plans), each shown by topic so the user can jump back to an old one
 * instead of scrolling through a long feed. Mirrors ConversationSidebar's
 * layout — including its mobile drawer behavior — for a consistent feel
 * across the app.
 */
export default function ItemSidebar({
  items,
  activeId,
  onSelect,
  onCreateNew,
  accentClass = "bg-brand-50 text-brand-700",
  isOpen = false,
  onClose,
  label = "Saved items",
}) {
  function handleSelect(id) {
    onSelect(id);
    onClose?.();
  }

  function handleCreateNew() {
    onCreateNew();
    onClose?.();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-16 md:top-auto bottom-0 md:bottom-auto left-0 z-40 w-72 md:w-64 shrink-0 border-r border-brand-100 bg-white flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="md:hidden flex items-center justify-between px-3 pt-3">
          <span className="text-sm font-display font-bold text-accent-burgundy">{label}</span>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-brand-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-3 border-b border-brand-100">
          <button
            onClick={handleCreateNew}
            className="w-full bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-xl py-2 shadow-glow transition"
          >
            + New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scroll">
          {items.length === 0 && (
            <p className="text-xs text-gray-400 p-4">Nothing generated yet.</p>
          )}
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full text-left px-4 py-3 border-b border-brand-50 transition ${
                item.id === activeId ? `${accentClass} font-semibold` : "hover:bg-brand-50/60 text-gray-600"
              }`}
            >
              <div className="text-sm truncate">{item.topic}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.difficulty}</div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
