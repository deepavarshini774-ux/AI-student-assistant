import { useEffect, useRef, useState } from "react";
import client from "../api/client.js";
import ConversationSidebar from "../components/ConversationSidebar.jsx";
import MessageBubble from "../components/MessageBubble.jsx";
import DifficultySelector from "../components/DifficultySelector.jsx";
import FileUpload from "../components/FileUpload.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [active, setActive] = useState(null);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingActive, setLoadingActive] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeId) loadConversation(activeId);
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages]);

  async function loadConversations() {
    setLoadingList(true);
    setError("");
    try {
      const res = await client.get("/chat/conversations");
      setConversations(res.data.conversations);
      if (res.data.conversations.length && !activeId) {
        setActiveId(res.data.conversations[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  }

  async function loadConversation(id) {
    setLoadingActive(true);
    setError("");
    try {
      const res = await client.get(`/chat/conversations/${id}`);
      setActive(res.data.conversation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActive(false);
    }
  }

  async function handleCreate() {
    setError("");
    try {
      const res = await client.post("/chat/conversations", { topic, difficulty });
      setConversations([res.data.conversation, ...conversations]);
      setActiveId(res.data.conversation.id);
      setTopic("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRename(id, title) {
    setError("");
    try {
      const res = await client.patch(`/chat/conversations/${id}`, { title });
      setConversations((prev) => prev.map((c) => (c.id === id ? res.data.conversation : c)));
      if (activeId === id) setActive((prev) => ({ ...prev, title }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !activeId) return;

    const userMsg = { role: "user", content: input, id: `temp-${Date.now()}` };
    setActive((prev) => ({ ...prev, messages: [...prev.messages, userMsg] }));
    setInput("");
    setSending(true);
    setError("");

    try {
      const res = await client.post(`/chat/conversations/${activeId}/messages`, {
        content: userMsg.content,
      });
      setActive((prev) => ({ ...prev, messages: [...prev.messages, res.data.message] }));
      // The backend auto-titles a fresh conversation from the first message —
      // refresh the sidebar list so the new name shows up there too.
      loadConversations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onCreate={handleCreate}
        onRename={handleRename}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col bg-brand-gradient-soft min-w-0">
        <div className="border-b border-gray-100 bg-white/70 backdrop-blur px-4 py-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 border border-brand-200 rounded-xl px-3 py-1.5 shrink-0"
          >
            ☰ Conversations
          </button>
          <input
            placeholder="Topic (optional, e.g. Recursion)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm flex-1 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
          {active && <FileUpload conversationId={activeId} onUploaded={() => loadConversation(activeId)} />}
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll px-4 py-4 space-y-3">
          {loadingList || loadingActive ? (
            <LoadingSpinner />
          ) : !active ? (
            <p className="text-center text-gray-400 text-sm mt-10">
              Create a conversation to start chatting.
            </p>
          ) : (
            <>
              {active.messages.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-10">
                  Ask a question about {active.topic || "anything you're studying"}.
                </p>
              )}
              {active.messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {sending && <LoadingSpinner label="Thinking..." />}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white/70 backdrop-blur p-3">
          <ErrorBanner message={error} />
          <form onSubmit={handleSend} className="flex gap-2 mt-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={!activeId || sending}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!activeId || sending || !input.trim()}
              className="bg-brand-gradient hover:opacity-90 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-5 shadow-glow transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
