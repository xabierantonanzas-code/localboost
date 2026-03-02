"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { useAIGeneration } from "@/hooks/use-ai-generation";
import { CompetitorCard } from "@/components/dashboard/competitor-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { CompetitorAnalysis } from "@/types";

interface AnalysisResult {
  competitors: CompetitorAnalysis[];
  market_opportunities: string[];
}

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeBusiness, completeStep } = useAppStore();
  const { generate, isGenerating } = useAIGeneration<AnalysisResult>();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!activeBusiness) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("competitor_analyses")
        .select("*")
        .eq("business_id", activeBusiness.id);
      if (data && data.length > 0) {
        setCompetitors(data as CompetitorAnalysis[]);
        completeStep(2);
      }
      setLoading(false);
    }
    load();
  }, [activeBusiness, supabase, completeStep]);

  async function runAnalysis() {
    if (!activeBusiness) {
      toast.error("Please set up your business first");
      return;
    }
    const result = await generate("/api/ai/analyze-competitors", {
      businessId: activeBusiness.id,
    });
    if (result) {
      setCompetitors(result.competitors);
      setOpportunities(result.market_opportunities);
      completeStep(2);
      toast.success("Competitor analysis complete!");
    } else {
      toast.error("Failed to analyze competitors");
    }
  }

  if (loading) return <LoadingState message="Loading competitors..." />;

  if (!activeBusiness) {
    return (
      <EmptyState
        icon={Search}
        title="Set up your business first"
        description="We need your business info to analyze the competition."
        actionLabel="Go to Business"
        onAction={() => {}}
      />
    );
  }

  if (competitors.length === 0 && !isGenerating) {
    return (
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Competitor Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover your local competition and find opportunities.
          </p>
        </div>
        <EmptyState
          icon={Search}
          title="Analyze your competition"
          description="Our AI will scan your local market and identify competitors, their strengths, weaknesses, and your opportunities."
          actionLabel="Run Analysis"
          onAction={runAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Competitor Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {competitors.length} competitors found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={runAnalysis}
            disabled={isGenerating}
            className="text-gray-400 hover:text-white gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            Re-analyze
          </Button>
          <Link href="/dashboard/strategy">
            <Button className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium gap-2">
              Generate Strategy
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {isGenerating ? (
        <LoadingState message="Analyzing local competition..." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {competitors.map((comp) => (
              <CompetitorCard key={comp.id} competitor={comp} />
            ))}
          </div>

          {opportunities.length > 0 && (
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-4">
                Market Opportunities
              </h3>
              <ul className="space-y-2">
                {opportunities.map((opp, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <ArrowRight className="h-4 w-4 text-[#E8FF5A] shrink-0 mt-0.5" />
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
