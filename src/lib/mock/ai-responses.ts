/* eslint-disable @typescript-eslint/no-explicit-any */
// Fallback mock AI responses when no AI API key is configured

export function getMockCompetitorAnalysis(business: any) {
  const sector = business?.sector || "services";
  const city = business?.location_city || "the area";

  return {
    competitors: [
      {
        competitor_name: `${sector === "restaurant" ? "Bella Vista Kitchen" : sector === "fitness" ? "FitZone Studio" : "Prime " + (business?.name || "Local") + " Co"}`,
        rating: 4.3,
        review_count: 187,
        address: `123 Main St, ${city}`,
        website_url: null,
        strengths: ["Strong social media presence", "Loyal customer base", "Prime location"],
        weaknesses: ["Outdated website", "Slow to adopt trends", "Limited online ordering"],
        threat_level: "high" as const,
        opportunities: ["Beat them on digital experience", "Target their unsatisfied customers"],
      },
      {
        competitor_name: `${sector === "restaurant" ? "The Corner Plate" : sector === "fitness" ? "BodyWorks Gym" : "Metro Services Plus"}`,
        rating: 3.8,
        review_count: 92,
        address: `456 Oak Ave, ${city}`,
        website_url: null,
        strengths: ["Competitive pricing", "Wide service range"],
        weaknesses: ["Poor reviews on service quality", "No social media", "Inconsistent branding"],
        threat_level: "medium" as const,
        opportunities: ["Differentiate on quality", "Capture their price-sensitive audience with better value"],
      },
      {
        competitor_name: `${sector === "restaurant" ? "Fresh & Fast Eats" : sector === "fitness" ? "Zen Yoga Collective" : "Neighborhood Experts"}`,
        rating: 4.6,
        review_count: 312,
        address: `789 Elm Blvd, ${city}`,
        website_url: null,
        strengths: ["Excellent reviews", "Modern branding", "Active community engagement"],
        weaknesses: ["Higher price point", "Limited hours", "Small team"],
        threat_level: "high" as const,
        opportunities: ["Offer more accessible hours", "Match quality at a better price point"],
      },
    ],
    market_opportunities: [
      "There is a gap in digital-first customer engagement in your local market",
      "Most competitors lack a cohesive content strategy — consistent posting would set you apart",
      "Community events and partnerships are underutilized by existing players",
      "Mobile experience is poor across all competitors — invest in mobile-friendly content",
      "User-generated content and reviews are untapped growth levers",
    ],
  };
}

export function getMockStrategy(business: any) {
  const name = business?.name || "Your Business";

  return {
    strategy: {
      positioning: `${name} is the go-to local choice for customers who want quality, authenticity, and a modern experience — without corporate impersonality.`,
      tone_of_voice: "Friendly, confident, and approachable. Speak like a knowledgeable neighbor — warm but professional. Use casual language with purpose and avoid jargon.",
      target_platforms: ["instagram", "facebook"],
      content_pillars: [
        { name: "Behind the Scenes", percentage: 30, description: "Show the human side — team, process, day-to-day moments", examples: ["Team spotlight Monday", "How we prepare for the week"] },
        { name: "Education & Tips", percentage: 25, description: "Share expertise and helpful advice related to your industry", examples: ["Quick tips carousel", "Did you know? facts"] },
        { name: "Social Proof", percentage: 25, description: "Customer stories, reviews, transformations", examples: ["Customer of the week", "Before/after showcase"] },
        { name: "Promotions & CTAs", percentage: 20, description: "Offers, events, seasonal campaigns", examples: ["Weekend special announcement", "Limited-time offer"] },
      ],
      hashtags: ["local", "shoplocal", "supportsmall", "community", name.toLowerCase().replace(/\s+/g, ""), "smallbusiness", "localbusiness", "entrepreneur", "growthmindset", "marketingtips", "socialmedia", "branding", "customersfirst", "behindthescenes", "qualitymatters"],
      posting_frequency: { instagram: 4, facebook: 3 },
      best_posting_times: { instagram: ["09:00", "12:30", "18:00"], facebook: ["10:00", "14:00", "19:00"] },
      kpis: [
        { name: "Follower Growth", target: "+15% per month", timeframe: "30 days" },
        { name: "Engagement Rate", target: "Above 3.5%", timeframe: "30 days" },
        { name: "Website Clicks", target: "50+ per week", timeframe: "7 days" },
        { name: "Customer Inquiries", target: "10+ per week from social", timeframe: "7 days" },
      ],
      full_strategy_text: `${name} should position itself as the authentic, community-driven alternative in the local market. By maintaining a consistent posting schedule across Instagram and Facebook, focusing on behind-the-scenes content and social proof, the brand can build trust and engagement.\n\nThe key differentiator is a modern digital presence combined with genuine community connection. While competitors rely on word-of-mouth alone, ${name} will actively engage audiences with valuable content, timely promotions, and responsive customer interaction.\n\nImmediate priorities should include establishing a content calendar, optimizing profiles with consistent branding, and launching a customer spotlight series to build social proof.`,
      ai_model: "mock",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    quick_wins: [
      "Optimize your Instagram and Facebook bios with a clear value proposition and CTA",
      "Post 3 customer testimonials this week as carousel posts",
      "Create a branded hashtag and encourage customers to use it",
      "Set up a Google Business profile if you haven't already",
      "Run a simple weekend giveaway to boost engagement and followers",
    ],
  };
}

export function getMockCampaign(business: any, weeks: number = 2) {
  const name = business?.name || "Your Business";
  const posts: any[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + daysUntilMonday);

  const platforms = ["instagram", "facebook"];
  const postTypes = ["post", "reel", "carousel", "story"];
  const times = ["09:00", "12:30", "18:00", "10:00", "14:00", "19:00"];

  const captions = [
    `Hey fam! \u{1F44B} Ready to start the week right? Here at ${name}, we're all about making YOUR day better.\n\nDrop a \u{2764}\uFE0F if you're ready for an amazing week!\n\n#shoplocal #community`,
    `Behind the scenes look at what makes ${name} special \u{2728}\n\nOur team puts heart into everything we do. Swipe to see the magic happen \u{27A1}\uFE0F\n\n#behindthescenes #authentic`,
    `\u{1F4E3} DID YOU KNOW?\n\nHere are 3 things most people don't realize about our industry:\n\n1\uFE0F\u20E3 Quality matters more than price\n2\uFE0F\u20E3 Consistency builds trust\n3\uFE0F\u20E3 Local beats corporate every time\n\nSave this for later! \u{1F516}`,
    `\u{2B50} CUSTOMER SPOTLIGHT \u{2B50}\n\nShoutout to our amazing customers who make it all worthwhile! Your support means the world to us.\n\nTag someone who needs to discover ${name}! \u{1F447}`,
    `Weekend vibes at ${name}! \u{1F389}\n\nWe've got something special planned — you won't want to miss this.\n\nStay tuned for the reveal tomorrow! \u{1F440}\n\n#weekendplans #exciting`,
    `\u{1F525} This week's PRO TIP:\n\nThe secret to getting the most out of your experience with us? Just ask! Our team loves helping you find exactly what you need.\n\nDM us anytime \u{1F4AC}`,
    `Happy Monday! Time to set the tone for an incredible week \u{1F4AA}\n\nWhat are YOUR goals this week? Drop them below and let's hold each other accountable!\n\n#MondayMotivation #goals`,
    `The results speak for themselves \u{1F4CA}\n\nOur customers keep coming back because we deliver. Period.\n\nReady to see what all the hype is about? Link in bio \u{261D}\uFE0F`,
  ];

  const visuals = [
    "Bright, well-lit photo of the team smiling at the workspace",
    "Short video clip showing the daily routine with upbeat music",
    "Carousel of 4-5 slides with tips overlaid on branded backgrounds",
    "Customer photo/testimonial with quote overlay",
    "Eye-catching product/service photo with bokeh background",
    "Behind-the-scenes video of preparation process",
    "Before/after transformation split image",
    "Story-style casual selfie video with text overlays",
  ];

  for (let w = 0; w < weeks; w++) {
    const postsPerWeek = 7;
    for (let p = 0; p < postsPerWeek; p++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + p);
      const dow = date.getDay();
      if (dow === 0) continue; // skip Sunday

      posts.push({
        day_of_week: dow,
        scheduled_date: date.toISOString().split("T")[0],
        scheduled_time: times[p % times.length],
        platform: platforms[p % platforms.length],
        post_type: postTypes[p % postTypes.length],
        caption: captions[(w * postsPerWeek + p) % captions.length],
        hashtags: ["shoplocal", "community", "smallbusiness", "supportlocal", name.toLowerCase().replace(/\s+/g, "")],
        visual_description: visuals[(w * postsPerWeek + p) % visuals.length],
      });
    }
  }

  return {
    campaign_name: `${name} — ${weeks}-Week Growth Sprint`,
    goal: `Increase brand awareness and engagement over ${weeks} weeks with consistent, high-quality content`,
    posts,
  };
}

export function getMockCopy(postType: string, platform: string, topic: string) {
  return `\u{2728} Let's talk about ${topic}!\n\nThis is something we're really passionate about here. Whether you're new or a longtime supporter, we want you to know — we're always working to bring you the best.\n\n\u{1F4A1} Here's why it matters:\n\u2022 It builds real connection\n\u2022 It sets us apart\n\u2022 It's what YOU deserve\n\nDouble tap if you agree! \u{2764}\uFE0F And share this ${postType} with someone who needs to see it.\n\n#${topic.replace(/\s+/g, "").toLowerCase()} #shoplocal #community #${platform}`;
}
