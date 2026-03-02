"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { useAIGeneration } from "@/hooks/use-ai-generation";
import { StrategyView } from "@/components/dashboard/strategy-view";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Strategy } from "@/types";

interface StrategyResult {
  strategy: Strategy;
  quick_wins: string[];
}

export default function StrategyPage() {
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [quickWins, setQuickWins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeBusiness, completeStep } = useAppStore();
  const { generate, isGenerating } = useAIGeneration<StrategyResult>();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!activeBusiness) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("strategies")
        .select("*")
        .eq("business_id", activeBusiness.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) {
        setStrategy(data as Strategy);
        completeStep(3);
      }
      setLoading(false);
    }
    load();
  }, [activeBusiness, supabase, completeStep]);

  async function generateStrategy() {
    if (!activeBusiness) {
      toast.error("Please set up your business first");
      return;
    }
    const result = await generate("/api/ai/generate-strategy", {
      businessId: activeBusiness.id,
    });
    if (result) {
      setStrategy(result.strategy);
      setQuickWins(result.quick_wins);
      completeStep(3);
      toast.success("Strategy generated!");
    } else {
      toast.error("Failed to generate strategy");
    }
  }

  if (loading) return <LoadingState message="Loading strategy..." />;

  if (!activeBusiness) {
    return (
      <EmptyState
        icon={Target}
        title="Set up your business first"
        description="We need your business info to generate a strategy."
      />
    );
  }

  if (!strategy && !isGenerating) {
    return (
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Marketing Strategy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-generated strategy tailored to your business.
          </p>
        </div>
        <EmptyState
          icon={Target}
          title="Generate your strategy"
          description="Our AI will create a complete marketing strategy based on your business and competitor data."
          actionLabel="Generate Strategy"
          onAction={generateStrategy}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Marketing Strategy
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your personalized marketing plan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={generateStrategy}
            disabled={isGenerating}
            className="text-gray-400 hover:text-white gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            Regenerate
          </Button>
          <Link href="/dashboard/campaign">
            <Button className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium gap-2">
              Generate Campaign
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {isGenerating ? (
        <LoadingState message="Crafting your strategy..." />
      ) : (
        <>
          {strategy && <StrategyView strategy={strategy} />}

          {quickWins.length > 0 && (
            <div className="mt-6 p-6 rounded-xl bg-[#E8FF5A]/[0.04] border border-[#E8FF5A]/20">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#E8FF5A] mb-3">
                Quick Wins
              </h3>
              <ul className="space-y-2">
                {quickWins.map((win, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <span className="text-xs font-mono text-[#E8FF5A] mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {win}
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
