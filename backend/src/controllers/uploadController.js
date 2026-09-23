import fs from "fs/promises";
import prisma from "../config/db.js";
import { extractTextFromFile } from "../services/fileParser.js";

const ALLOWED_MIMETYPES = new Set(["application/pdf", "text/plain"]);

export async function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  if (!ALLOWED_MIMETYPES.has(req.file.mimetype)) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ error: "Only .txt and .pdf files are supported." });
  }

  const { conversationId } = req.body;

  try {
    const extractedText = await extractTextFromFile(req.file.path, req.file.mimetype);

    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        conversationId: conversationId || null,
        filename: req.file.originalname,
        extractedText,
      },
    });

    res.status(201).json({
      document: {
        id: document.id,
        filename: document.filename,
        createdAt: document.createdAt,
        preview: extractedText.slice(0, 400),
      },
    });
  } finally {
    // We only persist the extracted text, not the raw file, to keep storage simple.
    await fs.unlink(req.file.path).catch(() => {});
  }
}
