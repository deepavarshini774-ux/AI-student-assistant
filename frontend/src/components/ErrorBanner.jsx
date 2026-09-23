export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
      <span>⚠️ {message}</span>
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline shrink-0">
          Try again
        </button>
      )}
    </div>
  );
}
