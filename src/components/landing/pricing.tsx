"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 29,
    features: [
      "1 campaign per month",
      "5 photo enhancements",
      "1 platform",
      "Basic content calendar",
      "Competitor analysis",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    monthlyPrice: 79,
    features: [
      "Unlimited campaigns",
      "20 photo enhancements",
      "3 platforms",
      "AI copywriting",
      "Advanced analytics",
      "Content pillars & KPIs",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    monthlyPrice: 149,
    features: [
      "Unlimited everything",
      "Unlimited photo enhancements",
      "All platforms",
      "SEO optimization",
      "Google Business integration",
      "Custom brand voice",
      "Dedicated account manager",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 px-4" id="pricing">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8FF5A]">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4">
            Simple, transparent pricing
          </h2>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={`text-sm ${!annual ? "text-white" : "text-gray-500"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[#E8FF5A]" : "bg-white/10"}`}
          >
            <div
              className={`absolute top-1 h-4 w-4 rounded-full transition-transform ${annual ? "translate-x-7 bg-black" : "translate-x-1 bg-white"}`}
            />
          </button>
          <span
            className={`text-sm ${annual ? "text-white" : "text-gray-500"}`}
          >
            Annual{" "}
            <span className="text-[#E8FF5A] text-xs font-mono">-20%</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = annual
              ? Math.round(plan.monthlyPrice * 0.8)
              : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.name}
                className={`relative p-8 rounded-xl border transition-colors ${
                  plan.highlighted
                    ? "bg-[#E8FF5A]/[0.04] border-[#E8FF5A]/30"
                    : "bg-white/[0.03] border-white/[0.06]"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E8FF5A] text-black text-xs font-mono font-bold uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-gray-500 text-sm">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-[#E8FF5A] shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className={`w-full rounded-lg py-5 font-medium ${
                      plan.highlighted
                        ? "bg-[#E8FF5A] text-black hover:bg-[#d4eb4a]"
                        : "bg-white/[0.06] text-white hover:bg-white/10"
                    }`}
                  >
                    Get started
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
