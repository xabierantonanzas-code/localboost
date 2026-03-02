"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useAppStore } from "@/stores/app-store";
import type { Profile, Business } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { activeBusiness, setActiveBusiness } = useAppStore();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profileData) setProfile(profileData as Profile);

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (businesses && businesses.length > 0 && !activeBusiness) {
        setActiveBusiness(businesses[0] as Business);
      }
    }
    loadData();
  }, [supabase, activeBusiness, setActiveBusiness]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar plan={profile?.subscription_status} />
      </div>

      {/* Main content */}
      <div className="lg:pl-60">
        <Topbar
          businessName={activeBusiness?.name}
          userName={profile?.full_name ?? "User"}
          plan={profile?.subscription_status}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
