"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="rounded-full bg-white/[0.03] border border-white/[0.06] p-6">
        <Icon className="h-10 w-10 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-2 bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
