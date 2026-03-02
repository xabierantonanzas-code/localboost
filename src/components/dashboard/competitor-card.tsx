"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CompetitorAnalysis } from "@/types";
import { THREAT_COLORS } from "@/types";

interface CompetitorCardProps {
  competitor: CompetitorAnalysis;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const threatColor = competitor.threat_level
    ? THREAT_COLORS[competitor.threat_level]
    : "#888";

  return (
    <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">
            {competitor.competitor_name}
          </h3>
          {competitor.address && (
            <p className="text-xs text-gray-500 mt-1">{competitor.address}</p>
          )}
        </div>
        <Badge
          className="font-mono text-xs uppercase"
          style={{
            backgroundColor: `${threatColor}15`,
            color: threatColor,
            borderColor: `${threatColor}30`,
          }}
        >
          {competitor.threat_level}
        </Badge>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-[#E8FF5A] text-[#E8FF5A]" />
          <span className="text-sm font-medium text-white">
            {competitor.rating?.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {competitor.review_count} reviews
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
            Strengths
          </h4>
          <ul className="space-y-1">
            {competitor.strengths.map((s, i) => (
              <li key={i} className="text-sm text-green-400/80 flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-green-400/80 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">
            Weaknesses
          </h4>
          <ul className="space-y-1">
            {competitor.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-red-400/80 flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-red-400/80 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
