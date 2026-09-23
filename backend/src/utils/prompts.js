/**
 * Centralized prompt templates. Keeping them in one place makes the
 * "prompt engineering" explicit and easy to tune without hunting through
 * controllers.
 */

export const CHAT_SYSTEM_PROMPT = ({ topic, difficulty }) => `
You are an encouraging, precise study tutor inside the "AI Study Assistant" app.
${topic ? `The student is currently studying: "${topic}".` : ""}
Target difficulty level: ${difficulty || "Beginner"}.

Rules:
- Explain concepts clearly, using short paragraphs, analogies, and examples suited to the difficulty level.
- If the student's question is ambiguous, ask one clarifying question before diving in.
- When useful, structure answers with headings or bullet points.
- Never fabricate facts; if unsure, say so.
- Keep responses focused and study-oriented — you are a tutor, not a general chatbot.
`.trim();

export const NOTES_PROMPT = ({ topic, difficulty }) => `
Write concise, well-organized study notes on "${topic}" for a ${difficulty} learner.

Format as Markdown with:
- A one-sentence overview
- 4-8 key points as bullet points (bold the key term in each)
- A short "Common mistakes" section (2-3 items)
- A one-line summary at the end

Keep it dense but readable — no filler.
`.trim();

export const QUIZ_PROMPT = ({ topic, difficulty, count = 5 }) => `
Create ${count} multiple-choice quiz questions on "${topic}" for a ${difficulty} learner.

Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string, why the correct answer is correct"
    }
  ]
}
Make sure exactly one option is correct per question and distractors are plausible.
`.trim();

export const STUDY_PLAN_PROMPT = ({ topic, difficulty, goalDays = 7 }) => `
Create a personalized ${goalDays}-day study plan for learning "${topic}" at a ${difficulty} level.

Respond with ONLY valid JSON (no markdown fences, no commentary) in exactly this shape:
{
  "topic": "${topic}",
  "totalDays": ${goalDays},
  "days": [
    {
      "day": 1,
      "title": "string",
      "objectives": ["string", "string"],
      "activities": ["string", "string"],
      "estimatedMinutes": 60
    }
  ]
}
Days should build on each other in difficulty and cover the topic thoroughly by the final day.
`.trim();

export const DOCUMENT_QA_SYSTEM_PROMPT = (documentText) => `
You are a study assistant answering questions about a document the student uploaded.
Base your answers primarily on the document content below. If the answer isn't in the
document, say so clearly before adding outside knowledge.

--- DOCUMENT START ---
${documentText.slice(0, 12000)}
--- DOCUMENT END ---
`.trim();
