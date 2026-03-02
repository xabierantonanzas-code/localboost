"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types";

const steps = [
  { num: 1, label: "Describe your business", href: "/dashboard/business" },
  { num: 2, label: "Analyze competitors", href: "/dashboard/competitors" },
  { num: 3, label: "Generate strategy", href: "/dashboard/strategy" },
  { num: 4, label: "Create campaign", href: "/dashboard/campaign" },
  { num: 5, label: "Enhance photos", href: "/dashboard/photos" },
];

export default function DashboardOverview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { activeBusiness, completedSteps } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    }
    loadProfile();
  }, [supabase]);

  const nextStep =
    steps.find((s) => !completedSteps.includes(s.num)) ?? steps[0];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s an overview of your marketing setup.
        </p>
      </div>

      {/* Progress wizard */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-4">
          Setup Progress
        </h2>
        <div className="space-y-3">
          {steps.map((step) => {
            const isComplete = completedSteps.includes(step.num);
            const isNext = step.num === nextStep.num && !isComplete;
            return (
              <Link
                key={step.num}
                href={step.href}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isNext
                    ? "bg-[#E8FF5A]/[0.06] border border-[#E8FF5A]/20"
                    : "hover:bg-white/[0.03]"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-mono ${
                    isComplete
                      ? "bg-green-400/20 text-green-400"
                      : isNext
                        ? "bg-[#E8FF5A]/20 text-[#E8FF5A]"
                        : "bg-white/[0.06] text-gray-500"
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isComplete
                      ? "text-gray-400 line-through"
                      : isNext
                        ? "text-white font-medium"
                        : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
                {isNext && (
                  <ArrowRight className="h-4 w-4 text-[#E8FF5A] ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Campaigns
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {profile?.campaigns_used_this_month ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Photos
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {profile?.photos_used_this_month ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Plan
          </span>
          <p className="text-2xl font-bold text-[#E8FF5A] mt-1 uppercase">
            {profile?.subscription_status ?? "Free"}
          </p>
        </div>
      </div>

      {/* Continue button */}
      <Link href={nextStep.href}>
        <Button className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium gap-2">
          Continue setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
