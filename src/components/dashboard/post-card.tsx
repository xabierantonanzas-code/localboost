"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, RefreshCw } from "lucide-react";
import type { CampaignPost } from "@/types";
import { POST_TYPE_COLORS } from "@/types";
import { dayName } from "@/lib/utils";

interface PostCardProps {
  post: CampaignPost;
  onRegenerateCopy?: (postId: string) => void;
  isRegenerating?: boolean;
}

export function PostCard({
  post,
  onRegenerateCopy,
  isRegenerating,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const typeColor = POST_TYPE_COLORS[post.post_type];

  async function copyCaption() {
    if (!post.caption) return;
    await navigator.clipboard.writeText(post.caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">
            {dayName(post.day_of_week)} {post.scheduled_time}
          </span>
          <Badge
            className="font-mono text-[10px] uppercase"
            style={{
              backgroundColor: `${typeColor}20`,
              color: typeColor,
              borderColor: `${typeColor}40`,
            }}
          >
            {post.post_type}
          </Badge>
        </div>
        <span className="text-xs font-mono text-gray-500 uppercase">
          {post.platform}
        </span>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          {post.caption && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
                  Caption
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCaption}
                    className="h-7 px-2 text-gray-400 hover:text-white"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  {onRegenerateCopy && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRegenerateCopy(post.id)}
                      disabled={isRegenerating}
                      className="h-7 px-2 text-gray-400 hover:text-white"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`}
                      />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                {post.caption}
              </p>
            </div>
          )}

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag) => (
                <span key={tag} className="text-xs text-[#E8FF5A]/70">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.visual_description && (
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 block mb-1">
                Visual
              </span>
              <p className="text-xs text-gray-500 italic">
                {post.visual_description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
