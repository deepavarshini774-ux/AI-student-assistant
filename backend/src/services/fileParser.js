import fs from "fs/promises";
import pdfParse from "pdf-parse";

/**
 * Extracts plain text from an uploaded .txt or .pdf file on disk.
 * Returns the text content; caller is responsible for deleting the temp file.
 */
export async function extractTextFromFile(filePath, mimetype) {
  if (mimetype === "application/pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  // Treat everything else as plain text (txt, md, etc.)
  return fs.readFile(filePath, "utf-8");
}
