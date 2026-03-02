import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[#E8FF5A]" />
          <span className="font-semibold text-lg">LocalBoost</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-sm bg-[#E8FF5A] text-black font-medium px-4 py-2 rounded-lg hover:bg-[#d4eb4a] transition-colors"
          >
            Start free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      <Hero />
      <HowItWorks />
      <Features />

      {/* Photo enhancement section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8FF5A]">
            Photo Enhancement
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
            Make your photos stand out
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-12">
            Upload your business photos and let our AI handle the rest. Get
            professional-quality images ready for every platform.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Light Correction", desc: "Auto-adjust brightness and exposure" },
              { title: "Smart Reframe", desc: "AI-powered composition" },
              { title: "Branded Filters", desc: "Match your brand aesthetic" },
              { title: "Multi-platform Resize", desc: "One photo, every format" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <h4 className="font-medium mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to automate your marketing?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of local businesses already growing with LocalBoost.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#E8FF5A] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#d4eb4a] transition-colors text-lg"
          >
            Start free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
