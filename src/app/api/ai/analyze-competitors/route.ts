import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, parseAIResponse, getActiveProvider } from "@/lib/ai/provider";
import { buildCompetitorAnalysisPrompt } from "@/lib/ai/prompts";
import { getMockCompetitorAnalysis } from "@/lib/mock/ai-responses";
import type { Business } from "@/types";

interface CompetitorResult {
  competitor_name: string;
  rating: number;
  review_count: number;
  address: string;
  website_url: string | null;
  strengths: string[];
  weaknesses: string[];
  threat_level: "low" | "medium" | "high";
  opportunities: string[];
}

interface AnalysisResponse {
  competitors: CompetitorResult[];
  market_opportunities: string[];
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

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    let analysis: AnalysisResponse;

    if (getActiveProvider()) {
      // Use real AI (Anthropic, OpenAI, or Gemini)
      let placesData: Record<string, unknown>[] | null = null;
      if (process.env.GOOGLE_PLACES_API_KEY) {
        try {
          const query = `${(business as Business).sector} near ${(business as Business).location_city} ${(business as Business).location_area}`;
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_PLACES_API_KEY}`
          );
          const data = await res.json();
          placesData = data.results?.slice(0, 5) ?? null;
        } catch {
          // Fall through to mock data
        }
      }
      const prompt = buildCompetitorAnalysisPrompt(business as Business, placesData);
      const text = await generateWithAI({ prompt, maxTokens: 4096 });
      analysis = parseAIResponse<AnalysisResponse>(text);
    } else {
      // Demo mode: use mock AI responses
      await new Promise((r) => setTimeout(r, 1500)); // simulate delay
      analysis = getMockCompetitorAnalysis(business);
    }

    // Delete existing competitors for this business
    await supabase
      .from("competitor_analyses")
      .delete()
      .eq("business_id", businessId);

    // Save new competitors
    const competitorInserts = analysis.competitors.map((c) => ({
      business_id: businessId,
      competitor_name: c.competitor_name,
      rating: c.rating,
      review_count: c.review_count,
      address: c.address,
      website_url: c.website_url,
      strengths: c.strengths,
      weaknesses: c.weaknesses,
      threat_level: c.threat_level,
      opportunities: c.opportunities,
    }));

    const { data: savedCompetitors } = await supabase
      .from("competitor_analyses")
      .insert(competitorInserts)
      .select();

    return NextResponse.json({
      competitors: savedCompetitors,
      market_opportunities: analysis.market_opportunities,
    });
  } catch (err) {
    console.error("Competitor analysis error:", err);
    return NextResponse.json(
      { error: "Failed to analyze competitors" },
      { status: 500 }
    );
  }
}
