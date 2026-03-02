"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { useAIGeneration } from "@/hooks/use-ai-generation";
import { CampaignCalendar } from "@/components/dashboard/campaign-calendar";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Campaign, CampaignPost } from "@/types";

interface CampaignResult {
  campaign: Campaign & { posts: CampaignPost[] };
}

export default function CampaignPage() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [posts, setPosts] = useState<CampaignPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState(2);
  const [regeneratingPostId, setRegeneratingPostId] = useState<string | null>(
    null
  );
  const { activeBusiness, completeStep } = useAppStore();
  const { generate, isGenerating } = useAIGeneration<CampaignResult>();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      if (!activeBusiness) {
        setLoading(false);
        return;
      }
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("*")
        .eq("business_id", activeBusiness.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (campaigns && campaigns.length > 0) {
        const camp = campaigns[0] as Campaign;
        setCampaign(camp);
        const { data: postData } = await supabase
          .from("campaign_posts")
          .select("*")
          .eq("campaign_id", camp.id)
          .order("scheduled_date", { ascending: true });
        if (postData) {
          setPosts(postData as CampaignPost[]);
          completeStep(4);
        }
      }
      setLoading(false);
    }
    load();
  }, [activeBusiness, supabase, completeStep]);

  async function generateCampaign() {
    if (!activeBusiness) {
      toast.error("Please set up your business first");
      return;
    }
    const result = await generate("/api/ai/generate-campaign", {
      businessId: activeBusiness.id,
      weeks,
    });
    if (result) {
      setCampaign(result.campaign);
      setPosts(result.campaign.posts ?? []);
      completeStep(4);
      toast.success("Campaign generated!");
    } else {
      toast.error("Failed to generate campaign");
    }
  }

  async function regenerateCopy(postId: string) {
    if (!activeBusiness) return;
    setRegeneratingPostId(postId);

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      const res = await fetch("/api/ai/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: activeBusiness.id,
          postType: post.post_type,
          platform: post.platform,
          topic: post.visual_description ?? post.caption?.slice(0, 50) ?? "engagement post",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const { caption } = await res.json();

      // Update in DB
      await supabase
        .from("campaign_posts")
        .update({ caption })
        .eq("id", postId);

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, caption } : p))
      );
      toast.success("Caption regenerated!");
    } catch {
      toast.error("Failed to regenerate copy");
    } finally {
      setRegeneratingPostId(null);
    }
  }

  if (loading) return <LoadingState message="Loading campaign..." />;

  if (!activeBusiness) {
    return (
      <EmptyState
        icon={Calendar}
        title="Set up your business first"
        description="We need your business info and strategy to generate a campaign."
      />
    );
  }

  if (!campaign && !isGenerating) {
    return (
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Campaign Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-generated content calendar with ready-to-publish posts.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Duration:
          </span>
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              onClick={() => setWeeks(w)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                weeks === w
                  ? "bg-[#E8FF5A]/10 border-[#E8FF5A]/30 text-[#E8FF5A]"
                  : "bg-white/[0.03] border-white/[0.06] text-gray-400 hover:border-white/20"
              }`}
            >
              {w} week{w > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <EmptyState
          icon={Calendar}
          title="Generate your campaign"
          description={`Create a ${weeks}-week content calendar with captions, hashtags, and visual descriptions.`}
          actionLabel="Generate Campaign"
          onAction={generateCampaign}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {campaign?.name ?? "Campaign Calendar"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length} posts planned &middot; {campaign?.goal}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={generateCampaign}
          disabled={isGenerating}
          className="text-gray-400 hover:text-white gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
          />
          Regenerate
        </Button>
      </div>

      {isGenerating ? (
        <LoadingState message="Generating your content calendar..." />
      ) : (
        <CampaignCalendar
          posts={posts}
          onRegenerateCopy={regenerateCopy}
          regeneratingPostId={regeneratingPostId}
        />
      )}
    </div>
  );
}
