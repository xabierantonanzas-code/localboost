"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Search,
  Target,
  Calendar,
  Camera,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/business", icon: Store, label: "Business" },
  { href: "/dashboard/competitors", icon: Search, label: "Competitors" },
  { href: "/dashboard/strategy", icon: Target, label: "Strategy" },
  { href: "/dashboard/campaign", icon: Calendar, label: "Campaign" },
  { href: "/dashboard/photos", icon: Camera, label: "Photos" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  plan?: string;
}

export function Sidebar({ plan = "free" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col z-40">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/[0.06]">
        <Zap className="h-5 w-5 text-[#E8FF5A]" />
        <span className="font-semibold text-white">LocalBoost</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-[#E8FF5A]/[0.06] text-[#E8FF5A] border border-[#E8FF5A]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <Badge className="bg-[#E8FF5A]/10 text-[#E8FF5A] font-mono text-xs uppercase hover:bg-[#E8FF5A]/10">
          {plan} plan
        </Badge>
      </div>
    </aside>
  );
}
