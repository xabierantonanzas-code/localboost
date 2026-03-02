"use client";

import { motion } from "framer-motion";
import { Search, Target, Calendar, Camera } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Competitor Analysis",
    description:
      "Discover who your local competitors are, their strengths and weaknesses, and untapped market opportunities.",
  },
  {
    icon: Target,
    title: "AI Strategy",
    description:
      "Get a complete marketing strategy with positioning, content pillars, hashtags, and KPIs tailored to your business.",
  },
  {
    icon: Calendar,
    title: "Campaign Calendar",
    description:
      "Receive weekly content calendars with ready-to-publish captions, hashtags, and visual descriptions.",
  },
  {
    icon: Camera,
    title: "Photo Enhancement",
    description:
      "Enhance your product and location photos with AI upscaling, light correction, and multi-platform resizing.",
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8FF5A]">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">
            Everything you need to grow locally
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            From competitor intelligence to ready-to-post content, LocalBoost
            handles your entire marketing workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-8 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#E8FF5A]/20 transition-colors group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="h-12 w-12 rounded-xl bg-[#E8FF5A]/10 flex items-center justify-center mb-6 group-hover:bg-[#E8FF5A]/20 transition-colors">
                <f.icon className="h-6 w-6 text-[#E8FF5A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
