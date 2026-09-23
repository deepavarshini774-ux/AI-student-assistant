import prisma from "../config/db.js";
import { askLLM } from "../services/llmService.js";
import { CHAT_SYSTEM_PROMPT, DOCUMENT_QA_SYSTEM_PROMPT } from "../utils/prompts.js";

// ---- Conversations -------------------------------------------------------

export async function listConversations(req, res) {
  const conversations = await prisma.conversation.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });
  res.json({ conversations });
}

export async function createConversation(req, res) {
  const { topic, difficulty } = req.body;
  const conversation = await prisma.conversation.create({
    data: {
      userId: req.user.id,
      topic: topic || null,
      difficulty: difficulty || "Beginner",
      title: topic ? `${topic}` : "New conversation",
    },
  });
  res.status(201).json({ conversation });
}

export async function getConversation(req, res) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { messages: { orderBy: { createdAt: "asc" } }, documents: true },
  });
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });
  res.json({ conversation });
}

export async function deleteConversation(req, res) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });

  await prisma.conversation.delete({ where: { id: conversation.id } });
  res.status(204).send();
}

export async function renameConversation(req, res) {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "title is required." });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });

  const updated = await prisma.conversation.update({
    where: { id: conversation.id },
    data: { title: title.trim().slice(0, 80) },
  });

  res.json({ conversation: updated });
}

// Turns a user's first message into a short, readable conversation title,
// e.g. "Can you explain how binary search trees work?" -> "Binary search trees work?"
function deriveTitleFromMessage(content) {
  const cleaned = content.trim().replace(/\s+/g, " ");
  const words = cleaned.split(" ");
  const short = words.slice(0, 6).join(" ");
  return short.length < cleaned.length ? `${short}...` : short;
}

// ---- Messages -------------------------------------------------------------

export async function sendMessage(req, res) {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      documents: true,
    },
  });
  if (!conversation) return res.status(404).json({ error: "Conversation not found." });

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "user", content },
  });

  // First message in a topic-less conversation? Give it a real name instead
  // of leaving it as "New conversation" forever.
  const isFirstMessage = conversation.messages.length === 0;
  if (isFirstMessage && (!conversation.title || conversation.title === "New conversation")) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { title: deriveTitleFromMessage(content) },
    });
  }

  // Ground the assistant in any uploaded document content for this conversation (bonus feature).
  const docContext = conversation.documents
    .map((d) => d.extractedText)
    .join("\n\n")
    .trim();

  const system = docContext
    ? `${CHAT_SYSTEM_PROMPT(conversation)}\n\n${DOCUMENT_QA_SYSTEM_PROMPT(docContext)}`
    : CHAT_SYSTEM_PROMPT(conversation);

  const history = [...conversation.messages, { role: "user", content }].map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  const reply = await askLLM({ system, messages: history });

  const assistantMessage = await prisma.message.create({
    data: { conversationId: conversation.id, role: "assistant", content: reply },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  res.status(201).json({ message: assistantMessage });
}
