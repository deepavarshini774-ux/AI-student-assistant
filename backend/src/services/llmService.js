import { GoogleGenerativeAI } from "@google/generative-ai";

// The API key is read only from environment variables — never hard-coded,
// never sent to the frontend. See "Secure API-key handling" in the task checklist.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Converts our internal {role: "user"|"assistant", content}[] history into
 * the shape Gemini expects: {role: "user"|"model", parts: [{text}]}[].
 */
function toGeminiHistory(messages) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

/**
 * Sends a chat-style request to Gemini.
 * @param {Object} params
 * @param {string} params.system - system instruction
 * @param {{role: "user"|"assistant", content: string}[]} params.messages
 * @param {number} [params.maxTokens]
 * @returns {Promise<string>} the model's text reply
 */
export async function askLLM({ system, messages, maxTokens = 1500 }) {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error(
      "GEMINI_API_KEY is not set on the server. Add it to backend/.env."
    );
    err.status = 500;
    throw err;
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
  });

  // The last message is the new user turn; everything before it is history.
  const history = toGeminiHistory(messages.slice(0, -1));
  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: maxTokens },
  });

  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

/**
 * Same as askLLM but strips markdown code fences and parses the result as JSON.
 * Used for quiz / study-plan generation where we ask the model for structured output.
 */
export async function askLLMForJSON(params) {
  const raw = await askLLM(params);
  const cleaned = raw.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const parseErr = new Error(
      "The AI returned a response that couldn't be parsed as JSON. Please try again."
    );
    parseErr.status = 502;
    throw parseErr;
  }
}
