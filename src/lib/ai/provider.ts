import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ── Provider detection ──────────────────────────────────────────────
export type AIProvider = "anthropic" | "openai" | "gemini";

/**
 * Detects the first available AI provider by checking env keys.
 * Priority: Anthropic → OpenAI → Gemini → null (mock fallback)
 */
export function getActiveProvider(): AIProvider | null {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return null;
}

// ── System prompt shared across all providers ───────────────────────
const SYSTEM_PROMPT =
  "You are a marketing AI assistant. Always respond with valid JSON when asked for JSON. Be creative, specific, and actionable. Focus on practical advice for small local businesses.";

// ── Generation options ──────────────────────────────────────────────
interface GenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

// ── Provider implementations ────────────────────────────────────────

async function generateWithAnthropic({
  prompt,
  maxTokens = 4096,
  temperature = 0.7,
}: GenerateOptions): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    temperature,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text;
  }
  throw new Error("Unexpected response type from Anthropic");
}

async function generateWithOpenAI({
  prompt,
  maxTokens = 4096,
  temperature = 0.7,
}: GenerateOptions): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: maxTokens,
    temperature,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (content) {
    return content;
  }
  throw new Error("No content in OpenAI response");
}

async function generateWithGemini({
  prompt,
  maxTokens = 4096,
  temperature = 0.7,
}: GenerateOptions): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (text) {
    return text;
  }
  throw new Error("No text in Gemini response");
}

// ── Unified generate function ───────────────────────────────────────

/**
 * Generates text using whichever AI provider is configured.
 * Automatically detects the provider from env vars.
 * Throws if no provider is configured (caller should check first or use mock).
 */
export async function generateWithAI(options: GenerateOptions): Promise<string> {
  const provider = getActiveProvider();

  switch (provider) {
    case "anthropic":
      return generateWithAnthropic(options);
    case "openai":
      return generateWithOpenAI(options);
    case "gemini":
      return generateWithGemini(options);
    default:
      throw new Error(
        "No AI provider configured. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY."
      );
  }
}

// ── JSON parsing helper ─────────────────────────────────────────────

export function parseAIResponse<T>(text: string): T {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned) as T;
}
