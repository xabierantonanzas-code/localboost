"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E8FF5A]/[0.03] via-transparent to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
            <span className="h-2 w-2 rounded-full bg-[#E8FF5A] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              AI-Powered Marketing Platform
            </span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your marketing strategy
          <br />
          <span className="text-[#E8FF5A]">in 5 minutes</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Describe your business, and our AI analyzes your competitors, creates a
          complete marketing strategy, generates campaign calendars, and enhances
          your photos. All on autopilot.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/signup">
            <Button className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-semibold px-8 py-6 text-base rounded-lg gap-2">
              Create my campaign free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/[0.03] px-8 py-6 text-base rounded-lg gap-2"
          >
            <Play className="h-4 w-4" />
            Watch demo
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <AnimatedCounter target={2847} suffix="+" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              Businesses
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-[#E8FF5A]">
              <AnimatedCounter target={340} suffix="%" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              Avg. ROI
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <AnimatedCounter target={12} suffix=" min" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mt-1">
              To first campaign
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
