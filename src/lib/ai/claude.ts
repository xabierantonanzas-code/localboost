import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT =
  "You are a marketing AI assistant. Always respond with valid JSON when asked for JSON. Be creative, specific, and actionable. Focus on practical advice for small local businesses.";

interface GenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateWithClaude({
  prompt,
  maxTokens = 4096,
  temperature = 0.7,
}: GenerateOptions): Promise<string> {
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
  throw new Error("Unexpected response type from Claude");
}

export function parseAIResponse<T>(text: string): T {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  return JSON.parse(cleaned) as T;
}
