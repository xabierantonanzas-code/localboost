"use client";

import { useState, useCallback } from "react";

export function useAIGeneration<T = unknown>() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const generate = useCallback(
    async (endpoint: string, body: Record<string, unknown>): Promise<T | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData.error || `Request failed with status ${res.status}`
          );
        }

        const data = (await res.json()) as T;
        setResult(data);
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generate, isGenerating, error, result };
}
