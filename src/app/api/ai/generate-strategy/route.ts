import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, parseAIResponse, getActiveProvider } from "@/lib/ai/provider";
import { buildStrategyPrompt } from "@/lib/ai/prompts";
import { getMockStrategy } from "@/lib/mock/ai-responses";
import type { Business, CompetitorAnalysis } from "@/types";

interface StrategyResponse {
  positioning: string;
  tone_of_voice: string;
  target_platforms: string[];
  content_pillars: {
    name: string;
    percentage: number;
    description: string;
    examples: string[];
  }[];
  hashtags: string[];
  posting_frequency: Record<string, number>;
  best_posting_times: Record<string, string[]>;
  kpis: { name: string; target: string; timeframe: string }[];
  quick_wins: string[];
  full_strategy_text: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await request.json();

    const { data: business } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const { data: competitors } = await supabase
      .from("competitor_analyses")
      .select("*")
      .eq("business_id", businessId);

    let strategyData: StrategyResponse;
    let quickWins: string[];

    if (getActiveProvider()) {
      const prompt = buildStrategyPrompt(
        business as Business,
        (competitors as CompetitorAnalysis[]) ?? []
      );
      const text = await generateWithAI({ prompt, maxTokens: 4096 });
      strategyData = parseAIResponse<StrategyResponse>(text);
      quickWins = strategyData.quick_wins;
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      const mock = getMockStrategy(business);
      strategyData = {
        positioning: mock.strategy.positioning,
        tone_of_voice: mock.strategy.tone_of_voice,
        target_platforms: mock.strategy.target_platforms,
        content_pillars: mock.strategy.content_pillars,
        hashtags: mock.strategy.hashtags,
        posting_frequency: mock.strategy.posting_frequency,
        best_posting_times: mock.strategy.best_posting_times,
        kpis: mock.strategy.kpis,
        quick_wins: mock.quick_wins,
        full_strategy_text: mock.strategy.full_strategy_text!,
      };
      quickWins = mock.quick_wins;
    }

    // Upsert strategy (replace existing if any)
    await supabase.from("strategies").delete().eq("business_id", businessId);

    const { data: savedStrategy } = await supabase
      .from("strategies")
      .insert({
        business_id: businessId,
        positioning: strategyData.positioning,
        tone_of_voice: strategyData.tone_of_voice,
        target_platforms: strategyData.target_platforms,
        hashtags: strategyData.hashtags,
        content_pillars: strategyData.content_pillars,
        kpis: strategyData.kpis,
        posting_frequency: strategyData.posting_frequency,
        best_posting_times: strategyData.best_posting_times,
        full_strategy_text: strategyData.full_strategy_text,
      })
      .select()
      .single();

    return NextResponse.json({ strategy: savedStrategy, quick_wins: quickWins });
  } catch (err) {
    console.error("Strategy generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate strategy" },
      { status: 500 }
    );
  }
}
