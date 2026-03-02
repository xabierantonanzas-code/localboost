import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#E8FF5A]" />
          <span className="font-semibold">LocalBoost</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Sign in
          </Link>
        </div>
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} LocalBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
