import type { Business, CompetitorAnalysis, Strategy } from "@/types";

export function buildCompetitorAnalysisPrompt(
  business: Business,
  placesData: Record<string, unknown>[] | null
): string {
  return `Analyze the local competition for this business:

Business: ${business.name}
Sector: ${business.sector}
Location: ${business.location_city}, ${business.location_area}
Description: ${business.description}
Target Audience: ${business.target_audience}
USPs: ${business.unique_selling_points?.join(", ")}

${
  placesData
    ? `Google Places data for nearby competitors:\n${JSON.stringify(placesData, null, 2)}`
    : "No Google Places data available. Generate 3-5 realistic mock competitors based on the business sector and location."
}

For each competitor, provide:
- competitor_name
- rating (1-5)
- review_count
- address
- website_url (can be null)
- strengths (array of 2-4 strengths)
- weaknesses (array of 2-4 weaknesses)
- threat_level ("low", "medium", or "high")
- opportunities (array of 1-3 market opportunities this competitor's weakness creates)

Also provide an overall "market_opportunities" array with 3-5 general opportunities for the business.

Respond with JSON in this format:
{
  "competitors": [...],
  "market_opportunities": [...]
}`;
}

export function buildStrategyPrompt(
  business: Business,
  competitors: CompetitorAnalysis[]
): string {
  return `Create a comprehensive marketing strategy for this local business:

Business: ${business.name}
Sector: ${business.sector}
Location: ${business.location_city}, ${business.location_area}
Description: ${business.description}
Target Audience: ${business.target_audience}
USPs: ${business.unique_selling_points?.join(", ")}
Monthly Budget: ${business.monthly_budget}

Competitor landscape:
${competitors
  .map(
    (c) =>
      `- ${c.competitor_name}: Rating ${c.rating}/5, ${c.review_count} reviews, Threat: ${c.threat_level}. Strengths: ${c.strengths.join(", ")}. Weaknesses: ${c.weaknesses.join(", ")}`
  )
  .join("\n")}

Generate a full marketing strategy. Respond with JSON:
{
  "positioning": "One clear positioning statement for the brand",
  "tone_of_voice": "Description of the brand voice and communication style",
  "target_platforms": ["instagram", "facebook"],
  "content_pillars": [
    {
      "name": "Pillar Name",
      "percentage": 30,
      "description": "What this pillar covers",
      "examples": ["Example post idea 1", "Example post idea 2"]
    }
  ],
  "hashtags": ["hashtag1", "hashtag2", "...15-20 total"],
  "posting_frequency": { "instagram": 4, "facebook": 3 },
  "best_posting_times": { "instagram": ["09:00", "18:00"], "facebook": ["12:00", "19:00"] },
  "kpis": [
    { "name": "KPI Name", "target": "Target value", "timeframe": "30 days" }
  ],
  "quick_wins": ["Quick win 1", "Quick win 2", "Quick win 3"],
  "full_strategy_text": "A 3-4 paragraph comprehensive strategy summary"
}`;
}

export function buildCampaignPrompt(
  business: Business,
  strategy: Strategy,
  weeks: number = 2
): string {
  return `Create a ${weeks}-week social media campaign calendar for this business:

Business: ${business.name}
Sector: ${business.sector}
Target Audience: ${business.target_audience}

Strategy:
- Positioning: ${strategy.positioning}
- Tone: ${strategy.tone_of_voice}
- Platforms: ${strategy.target_platforms.join(", ")}
- Content Pillars: ${strategy.content_pillars.map((p) => `${p.name} (${p.percentage}%)`).join(", ")}
- Posting Frequency: ${JSON.stringify(strategy.posting_frequency)}
- Best Times: ${JSON.stringify(strategy.best_posting_times)}
- Hashtags: ${strategy.hashtags.slice(0, 10).join(", ")}

Generate a campaign with posts for ${weeks} weeks. Each post must include:
- day_of_week (0=Sunday to 6=Saturday)
- scheduled_date (start from next Monday, format YYYY-MM-DD)
- scheduled_time (HH:MM format)
- platform (one of: ${strategy.target_platforms.join(", ")})
- post_type (one of: reel, story, post, carousel)
- caption (full ready-to-publish caption with emojis, line breaks using \\n, and a CTA at the end)
- hashtags (array of 5-10 relevant hashtags)
- visual_description (detailed description of the image/video to create)

Respond with JSON:
{
  "campaign_name": "Campaign Name",
  "goal": "Campaign goal description",
  "posts": [...]
}`;
}

export function buildCopyPrompt(
  business: Business,
  strategy: Strategy,
  postType: string,
  platform: string,
  topic: string
): string {
  return `Write a ${postType} caption for ${platform} about "${topic}" for this business:

Business: ${business.name}
Sector: ${business.sector}
Tone: ${strategy.tone_of_voice}
Positioning: ${strategy.positioning}
Hashtags to use: ${strategy.hashtags.slice(0, 8).join(", ")}

Guidelines:
- Match the tone of voice exactly
- Include emojis naturally
- Add line breaks for readability (use \\n)
- End with a clear call-to-action
- ${platform === "instagram" ? "Keep under 2200 characters" : "Keep concise and engaging"}
- Include 5-8 relevant hashtags at the end

Return ONLY the caption text, no JSON.`;
}
