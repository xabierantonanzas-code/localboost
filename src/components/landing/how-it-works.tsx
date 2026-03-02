"use client";

import { motion } from "framer-motion";
import { MessageSquare, Search, Target, Calendar } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Describe",
    description: "Tell us about your business, location, audience, and goals.",
  },
  {
    icon: Search,
    step: "02",
    title: "Analyze",
    description:
      "Our AI scans your local competition and finds market opportunities.",
  },
  {
    icon: Target,
    step: "03",
    title: "Strategy",
    description:
      "Get a personalized marketing strategy with content pillars and KPIs.",
  },
  {
    icon: Calendar,
    step: "04",
    title: "Campaign",
    description:
      "Receive a full social media calendar with ready-to-publish content.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8FF5A]">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">
            From zero to campaign in 4 steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              className="relative p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-xs font-mono text-[#E8FF5A] mb-4 block">
                {s.step}
              </span>
              <div className="h-10 w-10 rounded-lg bg-[#E8FF5A]/10 flex items-center justify-center mb-4">
                <s.icon className="h-5 w-5 text-[#E8FF5A]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
