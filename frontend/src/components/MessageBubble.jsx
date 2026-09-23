import ReactMarkdown from "react-markdown";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-pop-in ${
          isUser
            ? "bg-brand-gradient text-white rounded-br-sm shadow-glow"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        <div className={isUser ? "" : "prose prose-sm max-w-none"}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
