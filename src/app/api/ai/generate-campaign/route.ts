import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, parseAIResponse, getActiveProvider } from "@/lib/ai/provider";
import { buildCampaignPrompt } from "@/lib/ai/prompts";
import { getMockCampaign } from "@/lib/mock/ai-responses";
import type { Business, Strategy } from "@/types";

interface CampaignPostData {
  day_of_week: number;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  post_type: string;
  caption: string;
  hashtags: string[];
  visual_description: string;
}

interface CampaignResponse {
  campaign_name: string;
  goal: string;
  posts: CampaignPostData[];
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

    const { businessId, weeks = 2 } = await request.json();

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

    const { data: strategy } = await supabase
      .from("strategies")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!strategy) {
      return NextResponse.json(
        { error: "Generate a strategy first" },
        { status: 400 }
      );
    }

    let campaign: CampaignResponse;

    if (getActiveProvider()) {
      const prompt = buildCampaignPrompt(business as Business, strategy as Strategy, weeks);
      const text = await generateWithAI({ prompt, maxTokens: 8192 });
      campaign = parseAIResponse<CampaignResponse>(text);
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      campaign = getMockCampaign(business, weeks);
    }

    // Create campaign
    const { data: savedCampaign } = await supabase
      .from("campaigns")
      .insert({
        business_id: businessId,
        strategy_id: (strategy as Strategy).id,
        name: campaign.campaign_name,
        goal: campaign.goal,
        start_date: campaign.posts[0]?.scheduled_date,
        end_date: campaign.posts[campaign.posts.length - 1]?.scheduled_date,
        status: "draft",
      })
      .select()
      .single();

    if (!savedCampaign) {
      return NextResponse.json(
        { error: "Failed to create campaign" },
        { status: 500 }
      );
    }

    // Create posts
    const postInserts = campaign.posts.map((p) => ({
      campaign_id: savedCampaign.id,
      business_id: businessId,
      day_of_week: p.day_of_week,
      scheduled_date: p.scheduled_date,
      scheduled_time: p.scheduled_time,
      platform: p.platform,
      post_type: p.post_type,
      caption: p.caption,
      hashtags: p.hashtags,
      visual_description: p.visual_description,
      status: "draft",
    }));

    const { data: savedPosts } = await supabase
      .from("campaign_posts")
      .insert(postInserts)
      .select();

    // Increment campaigns used (ignore if RPC doesn't exist)
    try {
      await supabase.rpc("increment_campaigns_used", { user_id: user.id });
    } catch {
      // RPC may not exist yet
    }

    return NextResponse.json({
      campaign: { ...savedCampaign, posts: savedPosts },
    });
  } catch (err) {
    console.error("Campaign generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate campaign" },
      { status: 500 }
    );
  }
}
