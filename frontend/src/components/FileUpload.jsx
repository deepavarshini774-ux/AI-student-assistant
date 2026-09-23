import { useRef, useState } from "react";
import client from "../api/client.js";

export default function FileUpload({ conversationId, onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (conversationId) formData.append("conversationId", conversationId);

      const res = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(res.data.document);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.pdf,application/pdf,text/plain"
        onChange={handleFile}
        className="hidden"
        id="file-upload-input"
      />
      <label
        htmlFor="file-upload-input"
        className="text-xs font-medium text-brand-600 hover:text-brand-700 cursor-pointer border border-brand-200 rounded-full px-3 py-1"
      >
        {uploading ? "Uploading..." : "📎 Attach .txt / .pdf"}
      </label>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
