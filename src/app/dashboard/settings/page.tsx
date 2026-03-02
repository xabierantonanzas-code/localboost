"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSubscription } from "@/hooks/use-subscription";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Profile } from "@/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { plan, limits } = useSubscription();
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
      if (data) {
        const p = data as Profile;
        setProfile(p);
        setName(p.full_name ?? "");
      }
    }
    loadProfile();
  }, [supabase]);

  async function saveName() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Profile updated!");
    }
  }

  async function openPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.open(url, "_blank");
    } catch {
      toast.error("Failed to open billing portal");
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleUpgrade(priceEnv: string) {
    try {
      const priceId =
        priceEnv === "starter"
          ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
          : priceEnv === "growth"
            ? process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      toast.error("Failed to start checkout");
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Profile */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-500">
          Profile
        </h2>
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Full name</Label>
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/[0.03] border-white/[0.06] text-white"
            />
            <Button
              onClick={saveName}
              disabled={saving}
              className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] shrink-0"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Email</Label>
          <Input
            value={profile?.email ?? ""}
            disabled
            className="bg-white/[0.02] border-white/[0.04] text-gray-500"
          />
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Subscription */}
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-500">
            Subscription
          </h2>
          <Badge className="bg-[#E8FF5A]/10 text-[#E8FF5A] font-mono uppercase hover:bg-[#E8FF5A]/10">
            {plan}
          </Badge>
        </div>

        <div className="space-y-3">
          <UsageMeter
            label="Campaigns"
            used={profile?.campaigns_used_this_month ?? 0}
            limit={limits.campaigns}
          />
          <UsageMeter
            label="Photos"
            used={profile?.photos_used_this_month ?? 0}
            limit={limits.photos}
          />
        </div>

        {plan === "free" && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleUpgrade("starter")}
              variant="outline"
              className="border-white/[0.06] text-gray-300 hover:bg-white/[0.03]"
            >
              Starter $29/mo
            </Button>
            <Button
              onClick={() => handleUpgrade("growth")}
              className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a]"
            >
              Growth $79/mo
            </Button>
          </div>
        )}
      </div>

      {/* Billing */}
      {profile?.stripe_customer_id && (
        <>
          <Separator className="bg-white/[0.06]" />
          <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-4">
              Billing
            </h2>
            <Button
              onClick={openPortal}
              disabled={portalLoading}
              variant="outline"
              className="border-white/[0.06] text-gray-300 hover:bg-white/[0.03] gap-2"
            >
              {portalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Manage billing
            </Button>
          </div>
        </>
      )}

      <Separator className="bg-white/[0.06]" />

      {/* Danger zone */}
      <div className="p-6 rounded-xl bg-red-500/[0.03] border border-red-500/10">
        <h2 className="text-xs font-mono uppercase tracking-wider text-red-400/70 mb-4">
          Danger Zone
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#141414] border-white/[0.06]">
            <DialogHeader>
              <DialogTitle className="text-white">
                Delete your account?
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                This action cannot be undone. All your data, businesses,
                campaigns, and photos will be permanently deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-white/[0.06] text-gray-300"
              >
                Cancel
              </Button>
              <Button className="bg-red-500 text-white hover:bg-red-600">
                Delete forever
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
