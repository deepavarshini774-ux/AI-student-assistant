import { useState } from "react";

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onRename,
  isOpen = false,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  function startEdit(e, conv) {
    e.stopPropagation();
    setEditingId(conv.id);
    setDraft(conv.title || "");
  }

  function commitEdit(id) {
    if (draft.trim()) onRename(id, draft.trim());
    setEditingId(null);
  }

  function handleSelect(id) {
    onSelect(id);
    onClose?.();
  }

  function handleCreate() {
    onCreate();
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
          <span className="text-sm font-display font-bold text-accent-burgundy">Conversations</span>
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
            onClick={handleCreate}
            className="w-full bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-xl py-2 shadow-glow transition"
          >
            + New conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scroll">
          {conversations.length === 0 && (
            <p className="text-xs text-gray-400 p-4">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => editingId !== c.id && handleSelect(c.id)}
              className={`group w-full text-left px-4 py-3 border-b border-brand-50 text-sm cursor-pointer flex items-center justify-between gap-2 transition ${
                c.id === activeId ? "bg-brand-50 text-brand-700 font-semibold" : "hover:bg-brand-50/60 text-gray-600"
              }`}
            >
              {editingId === c.id ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => commitEdit(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit(c.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full border border-brand-300 rounded-lg px-2 py-1 text-sm focus:outline-none"
                />
              ) : (
                <>
                  <span className="truncate">{c.title || "New conversation"}</span>
                  <button
                    onClick={(e) => startEdit(e, c)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-gray-400 hover:text-brand-600 shrink-0 transition"
                    title="Rename"
                  >
                    ✏️
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
