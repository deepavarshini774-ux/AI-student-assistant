import prisma from "../config/db.js";
import { askLLM, askLLMForJSON } from "../services/llmService.js";
import { NOTES_PROMPT, QUIZ_PROMPT, STUDY_PLAN_PROMPT } from "../utils/prompts.js";

// ---- Notes -----------------------------------------------------------------

export async function generateNotes(req, res) {
  const { topic, difficulty = "Beginner" } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required." });

  const content = await askLLM({
    system: "You are a precise, concise study-notes generator. Respond in Markdown only.",
    messages: [{ role: "user", content: NOTES_PROMPT({ topic, difficulty }) }],
  });

  const note = await prisma.note.create({
    data: { userId: req.user.id, topic, difficulty, content },
  });

  res.status(201).json({ note });
}

export async function listNotes(req, res) {
  const notes = await prisma.note.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ notes });
}

export async function getNote(req, res) {
  const note = await prisma.note.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!note) return res.status(404).json({ error: "Note not found." });
  res.json({ note });
}

// ---- Quizzes ----------------------------------------------------------------

export async function generateQuiz(req, res) {
  const { topic, difficulty = "Beginner", count = 5 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required." });

  const parsed = await askLLMForJSON({
    system: "You generate quiz questions and respond with ONLY valid JSON, nothing else.",
    messages: [{ role: "user", content: QUIZ_PROMPT({ topic, difficulty, count }) }],
    maxTokens: 2000,
  });

  const quiz = await prisma.quiz.create({
    data: {
      userId: req.user.id,
      topic,
      difficulty,
      content: JSON.stringify(parsed),
    },
  });

  res.status(201).json({ quiz: { ...quiz, content: parsed } });
}

export async function listQuizzes(req, res) {
  const quizzes = await prisma.quiz.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({
    quizzes: quizzes.map((q) => ({ ...q, content: JSON.parse(q.content) })),
  });
}

// ---- Study plans --------------------------------------------------------------

export async function generateStudyPlan(req, res) {
  const { topic, difficulty = "Beginner", goalDays = 7 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required." });

  const parsed = await askLLMForJSON({
    system: "You generate structured study plans and respond with ONLY valid JSON, nothing else.",
    messages: [{ role: "user", content: STUDY_PLAN_PROMPT({ topic, difficulty, goalDays }) }],
    maxTokens: 2500,
  });

  const plan = await prisma.studyPlan.create({
    data: {
      userId: req.user.id,
      topic,
      difficulty,
      goalDays,
      content: JSON.stringify(parsed),
    },
  });

  res.status(201).json({ studyPlan: { ...plan, content: parsed } });
}

export async function listStudyPlans(req, res) {
  const plans = await prisma.studyPlan.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({
    studyPlans: plans.map((p) => ({ ...p, content: JSON.parse(p.content) })),
  });
}
