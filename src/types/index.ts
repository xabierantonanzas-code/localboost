// ── Union Types ──────────────────────────────────────────────
export type BusinessSector =
  | "fitness"
  | "restaurant"
  | "beauty"
  | "retail"
  | "services"
  | "health"
  | "education"
  | "automotive"
  | "real_estate"
  | "food_delivery"
  | "other";

export type BudgetRange =
  | "under_200"
  | "200_500"
  | "500_1000"
  | "over_1000";

export type Platform =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "twitter"
  | "google_business";

export type PostType =
  | "reel"
  | "story"
  | "post"
  | "carousel"
  | "live"
  | "article";

export type SubscriptionStatus =
  | "free"
  | "starter"
  | "growth"
  | "pro"
  | "cancelled";

export type ThreatLevel = "low" | "medium" | "high";

export type EnhancementStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export type PostStatus = "draft" | "ready" | "published";

// ── Interfaces ──────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  subscription_id: string | null;
  subscription_period_end: string | null;
  photos_used_this_month: number;
  campaigns_used_this_month: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  sector: BusinessSector | null;
  location_city: string | null;
  location_area: string | null;
  location_country: string;
  latitude: number | null;
  longitude: number | null;
  website_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  google_business_url: string | null;
  target_audience: string | null;
  unique_selling_points: string[];
  monthly_budget: BudgetRange | null;
  logo_url: string | null;
  brand_colors: string[];
  created_at: string;
  updated_at: string;
}

export interface CompetitorAnalysis {
  id: string;
  business_id: string;
  competitor_name: string;
  google_place_id: string | null;
  rating: number | null;
  review_count: number | null;
  address: string | null;
  website_url: string | null;
  strengths: string[];
  weaknesses: string[];
  social_presence: Record<string, unknown>;
  threat_level: ThreatLevel | null;
  opportunities: string[];
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface ContentPillar {
  name: string;
  percentage: number;
  description: string;
  examples: string[];
}

export interface KPI {
  name: string;
  target: string;
  timeframe: string;
}

export interface Strategy {
  id: string;
  business_id: string;
  positioning: string;
  tone_of_voice: string;
  target_platforms: Platform[];
  hashtags: string[];
  content_pillars: ContentPillar[];
  kpis: KPI[];
  posting_frequency: Record<string, number>;
  best_posting_times: Record<string, string[]>;
  full_strategy_text: string | null;
  ai_model: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  strategy_id: string | null;
  name: string;
  status: CampaignStatus;
  start_date: string | null;
  end_date: string | null;
  goal: string | null;
  created_at: string;
  updated_at: string;
  posts?: CampaignPost[];
}

export interface EngagementData {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reach?: number;
  impressions?: number;
}

export interface CampaignPost {
  id: string;
  campaign_id: string;
  business_id: string;
  day_of_week: number;
  scheduled_date: string | null;
  scheduled_time: string | null;
  platform: Platform;
  post_type: PostType;
  caption: string | null;
  hashtags: string[];
  visual_description: string | null;
  image_url: string | null;
  status: PostStatus;
  engagement_data: EngagementData | null;
  created_at: string;
  updated_at: string;
}

export interface EnhancementOptions {
  upscale?: boolean;
  denoise?: boolean;
  brightness?: number;
  contrast?: number;
}

export interface Photo {
  id: string;
  business_id: string;
  user_id: string;
  original_url: string;
  enhanced_url: string | null;
  original_filename: string | null;
  file_size: number | null;
  mime_type: string | null;
  enhancement_status: EnhancementStatus;
  enhancement_options: EnhancementOptions;
  resized_versions: Record<string, string>;
  created_at: string;
}

// ── Plan Limits ─────────────────────────────────────────────
export interface PlanLimit {
  campaigns: number;
  photos: number;
  platforms: number;
}

export const PLAN_LIMITS: Record<SubscriptionStatus, PlanLimit> = {
  free: { campaigns: 1, photos: 3, platforms: 1 },
  starter: { campaigns: 2, photos: 5, platforms: 1 },
  growth: { campaigns: Infinity, photos: 20, platforms: 3 },
  pro: { campaigns: Infinity, photos: Infinity, platforms: Infinity },
  cancelled: { campaigns: 1, photos: 3, platforms: 1 },
};

// ── Sector Labels ───────────────────────────────────────────
export const SECTOR_LABELS: Record<BusinessSector, string> = {
  fitness: "Fitness & Gym",
  restaurant: "Restaurant & Café",
  beauty: "Beauty & Wellness",
  retail: "Retail & Shopping",
  services: "Professional Services",
  health: "Health & Medical",
  education: "Education & Tutoring",
  automotive: "Automotive",
  real_estate: "Real Estate",
  food_delivery: "Food Delivery",
  other: "Other",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
  under_200: "Under $200",
  "200_500": "$200 – $500",
  "500_1000": "$500 – $1,000",
  over_1000: "Over $1,000",
};

export const POST_TYPE_COLORS: Record<PostType, string> = {
  reel: "#ff5a78",
  story: "#a05aff",
  post: "#5ab4ff",
  carousel: "#ffb432",
  live: "#4ade80",
  article: "#888888",
};

export const THREAT_COLORS: Record<ThreatLevel, string> = {
  low: "#4ade80",
  medium: "#ffb432",
  high: "#ff5a78",
};
