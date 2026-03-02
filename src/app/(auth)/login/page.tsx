"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap className="h-6 w-6 text-[#E8FF5A]" />
          <span className="text-xl font-semibold text-white">LocalBoost</span>
        </div>

        <div className="p-8 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <h1 className="text-xl font-semibold text-white mb-6">Sign in</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-400 text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-gray-600"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium py-5"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#E8FF5A] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
