/**
 * Downloads any text content as a file in the browser — used for
 * "Export notes or quizzes" (bonus feature). No backend call needed.
 */
export default function ExportButton({ filename, content, label = "Export" }) {
  function handleExport() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="text-xs font-medium text-gray-600 hover:text-brand-700 border border-gray-300 rounded-full px-3 py-1"
    >
      ⬇ {label}
    </button>
  );
}
