"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, CreditCard, LogOut } from "lucide-react";
import { Sidebar } from "./sidebar";
import Link from "next/link";

interface TopbarProps {
  businessName?: string;
  userName?: string;
  plan?: string;
}

export function Topbar({
  businessName,
  userName = "User",
  plan,
}: TopbarProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/[0.06]">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-400"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-60 p-0 bg-[#0a0a0a] border-white/[0.06]"
          >
            <Sidebar plan={plan} />
          </SheetContent>
        </Sheet>

        {businessName && (
          <h2 className="text-sm font-medium text-white truncate">
            {businessName}
          </h2>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full bg-white/[0.06]"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-white/[0.06] text-white text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#141414] border-white/[0.06]"
        >
          <DropdownMenuItem asChild className="cursor-pointer text-gray-300">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer text-gray-300">
            <Link href="/dashboard/settings">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-gray-300"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
