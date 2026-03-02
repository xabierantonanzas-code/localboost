"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Strategy } from "@/types";

interface StrategyViewProps {
  strategy: Strategy;
}

export function StrategyView({ strategy }: StrategyViewProps) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="space-y-6">
      {/* Positioning */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
          Positioning
        </h3>
        <p className="text-lg italic text-white leading-relaxed">
          &ldquo;{strategy.positioning}&rdquo;
        </p>
      </div>

      {/* Tone */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
          Tone of Voice
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {strategy.tone_of_voice}
        </p>
      </div>

      {/* Content Pillars */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-4">
          Content Pillars
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strategy.content_pillars.map((pillar) => (
            <div
              key={pillar.name}
              className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {pillar.name}
                </span>
                <span className="text-xs font-mono text-[#E8FF5A]">
                  {pillar.percentage}%
                </span>
              </div>
              <Progress value={pillar.percentage} className="h-1 mb-3" />
              <p className="text-xs text-gray-400 mb-2">
                {pillar.description}
              </p>
              {pillar.examples.length > 0 && (
                <ul className="space-y-1">
                  {pillar.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-500 flex items-start gap-1.5"
                    >
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-gray-600 shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hashtags */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
          Hashtags
        </h3>
        <div className="flex flex-wrap gap-2">
          {strategy.hashtags.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#E8FF5A]/10 text-[#E8FF5A] font-mono text-xs hover:bg-[#E8FF5A]/10"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posting Frequency */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
          Posting Frequency
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(strategy.posting_frequency).map(
            ([platform, count]) => (
              <div
                key={platform}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center"
              >
                <span className="text-xs font-mono uppercase text-gray-500 block">
                  {platform}
                </span>
                <span className="text-lg font-semibold text-white">
                  {count}x
                </span>
                <span className="text-xs text-gray-500 block">/week</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-3">
          KPIs
        </h3>
        <ol className="space-y-2">
          {strategy.kpis.map((kpi, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-xs font-mono text-[#E8FF5A] mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="text-white font-medium">{kpi.name}</span>
                <span className="text-gray-500">
                  {" "}
                  — {kpi.target} ({kpi.timeframe})
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Full Strategy */}
      {strategy.full_strategy_text && (
        <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-white transition-colors w-full"
          >
            Full Strategy Document
            {showFull ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showFull && (
            <p className="text-sm text-gray-300 leading-relaxed mt-4 whitespace-pre-wrap">
              {strategy.full_strategy_text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
