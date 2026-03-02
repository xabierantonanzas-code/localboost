"use client";

import { BusinessForm } from "@/components/dashboard/business-form";

export default function BusinessPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Your Business</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your business so we can create a tailored marketing
          strategy.
        </p>
      </div>
      <BusinessForm />
    </div>
  );
}
