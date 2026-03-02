"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, SubscriptionStatus, PlanLimit } from "@/types";
import { PLAN_LIMITS } from "@/types";

export function useSubscription() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data as Profile);
      setIsLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const plan: SubscriptionStatus = profile?.subscription_status ?? "free";
  const limits: PlanLimit = PLAN_LIMITS[plan];

  const canUseFeature = (
    feature: "campaigns" | "photos" | "platforms"
  ): boolean => {
    if (!profile) return false;
    const limit = limits[feature];
    if (limit === Infinity) return true;

    if (feature === "campaigns") {
      return profile.campaigns_used_this_month < limit;
    }
    if (feature === "photos") {
      return profile.photos_used_this_month < limit;
    }
    return true;
  };

  return { profile, plan, limits, canUseFeature, isLoading };
}
