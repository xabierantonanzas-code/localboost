"use client";

import { Progress } from "@/components/ui/progress";

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
}

export function UsageMeter({ label, used, limit }: UsageMeterProps) {
  const isUnlimited = limit === Infinity;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
          {label}
        </span>
        <span
          className={`text-xs font-mono ${isNearLimit ? "text-[#ffb432]" : "text-gray-400"}`}
        >
          {used} / {isUnlimited ? "\u221E" : limit}
        </span>
      </div>
      <Progress
        value={isUnlimited ? 0 : percentage}
        className="h-1.5"
      />
    </div>
  );
}
