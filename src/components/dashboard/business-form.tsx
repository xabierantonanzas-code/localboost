"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useBusiness } from "@/hooks/use-business";
import {
  SECTOR_LABELS,
  BUDGET_LABELS,
  type BusinessSector,
  type BudgetRange,
  type Business,
} from "@/types";

export function BusinessForm() {
  const { activeBusiness, saveBusiness } = useBusiness();
  const router = useRouter();

  const [form, setForm] = useState({
    name: activeBusiness?.name ?? "",
    description: activeBusiness?.description ?? "",
    sector: (activeBusiness?.sector ?? "") as BusinessSector | "",
    location_city: activeBusiness?.location_city ?? "",
    location_area: activeBusiness?.location_area ?? "",
    website_url: activeBusiness?.website_url ?? "",
    instagram_url: activeBusiness?.instagram_url ?? "",
    facebook_url: activeBusiness?.facebook_url ?? "",
    target_audience: activeBusiness?.target_audience ?? "",
    unique_selling_points: activeBusiness?.unique_selling_points ?? [],
    monthly_budget: (activeBusiness?.monthly_budget ?? "") as BudgetRange | "",
  });
  const [uspInput, setUspInput] = useState("");
  const [saving, setSaving] = useState(false);

  function handleUspAdd(e: React.KeyboardEvent) {
    if (e.key === "Enter" && uspInput.trim()) {
      e.preventDefault();
      setForm((f) => ({
        ...f,
        unique_selling_points: [...f.unique_selling_points, uspInput.trim()],
      }));
      setUspInput("");
    }
  }

  function removeUsp(index: number) {
    setForm((f) => ({
      ...f,
      unique_selling_points: f.unique_selling_points.filter(
        (_, i) => i !== index
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Business name is required");
      return;
    }
    setSaving(true);
    const result = await saveBusiness(form as Partial<Business>);
    setSaving(false);
    if (result) {
      toast.success("Business saved!");
      router.push("/dashboard/competitors");
    } else {
      toast.error("Failed to save business");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Business name *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="My Awesome Business"
          className="bg-white/[0.03] border-white/[0.06] text-white"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Describe what your business does, its values, and what makes it special..."
          rows={4}
          className="bg-white/[0.03] border-white/[0.06] text-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Sector</Label>
        <Select
          value={form.sector}
          onValueChange={(v) =>
            setForm((f) => ({ ...f, sector: v as BusinessSector }))
          }
        >
          <SelectTrigger className="bg-white/[0.03] border-white/[0.06] text-white">
            <SelectValue placeholder="Select a sector" />
          </SelectTrigger>
          <SelectContent className="bg-[#141414] border-white/[0.06]">
            {Object.entries(SECTOR_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key} className="text-gray-300">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">City</Label>
          <Input
            value={form.location_city}
            onChange={(e) =>
              setForm((f) => ({ ...f, location_city: e.target.value }))
            }
            placeholder="San Francisco"
            className="bg-white/[0.03] border-white/[0.06] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Area / Neighborhood</Label>
          <Input
            value={form.location_area}
            onChange={(e) =>
              setForm((f) => ({ ...f, location_area: e.target.value }))
            }
            placeholder="Mission District"
            className="bg-white/[0.03] border-white/[0.06] text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Website URL</Label>
        <Input
          value={form.website_url}
          onChange={(e) =>
            setForm((f) => ({ ...f, website_url: e.target.value }))
          }
          placeholder="https://mybusiness.com"
          className="bg-white/[0.03] border-white/[0.06] text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Instagram URL</Label>
          <Input
            value={form.instagram_url}
            onChange={(e) =>
              setForm((f) => ({ ...f, instagram_url: e.target.value }))
            }
            placeholder="https://instagram.com/mybiz"
            className="bg-white/[0.03] border-white/[0.06] text-white"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-400 text-sm">Facebook URL</Label>
          <Input
            value={form.facebook_url}
            onChange={(e) =>
              setForm((f) => ({ ...f, facebook_url: e.target.value }))
            }
            placeholder="https://facebook.com/mybiz"
            className="bg-white/[0.03] border-white/[0.06] text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Target audience</Label>
        <Textarea
          value={form.target_audience}
          onChange={(e) =>
            setForm((f) => ({ ...f, target_audience: e.target.value }))
          }
          placeholder="Who are your ideal customers? E.g., Women 25-45, health-conscious, local residents..."
          rows={3}
          className="bg-white/[0.03] border-white/[0.06] text-white resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">
          Unique selling points{" "}
          <span className="text-gray-600">(press Enter to add)</span>
        </Label>
        <Input
          value={uspInput}
          onChange={(e) => setUspInput(e.target.value)}
          onKeyDown={handleUspAdd}
          placeholder="E.g., Organic ingredients, 24/7 service..."
          className="bg-white/[0.03] border-white/[0.06] text-white"
        />
        {form.unique_selling_points.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.unique_selling_points.map((usp, i) => (
              <Badge
                key={i}
                className="bg-[#E8FF5A]/10 text-[#E8FF5A] font-mono text-xs gap-1 hover:bg-[#E8FF5A]/10"
              >
                {usp}
                <button type="button" onClick={() => removeUsp(i)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-400 text-sm">Monthly marketing budget</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BUDGET_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setForm((f) => ({ ...f, monthly_budget: key as BudgetRange }))
              }
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                form.monthly_budget === key
                  ? "bg-[#E8FF5A]/10 border-[#E8FF5A]/30 text-[#E8FF5A]"
                  : "bg-white/[0.03] border-white/[0.06] text-gray-400 hover:border-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] font-medium px-8"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Save & continue
      </Button>
    </form>
  );
}
