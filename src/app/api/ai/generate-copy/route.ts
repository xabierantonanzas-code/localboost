import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, getActiveProvider } from "@/lib/ai/provider";
import { buildCopyPrompt } from "@/lib/ai/prompts";
import { getMockCopy } from "@/lib/mock/ai-responses";
import type { Business, Strategy } from "@/types";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, postType, platform, topic } = await request.json();

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

    let caption: string;

    if (getActiveProvider()) {
      const prompt = buildCopyPrompt(business as Business, strategy as Strategy, postType, platform, topic);
      caption = await generateWithAI({ prompt, maxTokens: 1024, temperature: 0.8 });
    } else {
      await new Promise((r) => setTimeout(r, 1000));
      caption = getMockCopy(postType, platform, topic);
    }

    return NextResponse.json({ caption: caption.trim() });
  } catch (err) {
    console.error("Copy generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
