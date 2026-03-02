"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "./post-card";
import type { CampaignPost } from "@/types";
import { dayName } from "@/lib/utils";

interface CampaignCalendarProps {
  posts: CampaignPost[];
  onRegenerateCopy?: (postId: string) => void;
  regeneratingPostId?: string | null;
}

export function CampaignCalendar({
  posts,
  onRegenerateCopy,
  regeneratingPostId,
}: CampaignCalendarProps) {
  const [view, setView] = useState<"calendar" | "list">("calendar");

  // Group posts by week
  const weeks: Map<string, CampaignPost[]> = new Map();
  posts.forEach((post) => {
    if (!post.scheduled_date) return;
    const date = new Date(post.scheduled_date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1); // Monday
    const weekKey = weekStart.toISOString().split("T")[0];
    if (!weeks.has(weekKey)) weeks.set(weekKey, []);
    weeks.get(weekKey)!.push(post);
  });

  const weekEntries = Array.from(weeks.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  // Group posts by day of week for calendar view
  function groupByDay(weekPosts: CampaignPost[]) {
    const days: Map<number, CampaignPost[]> = new Map();
    weekPosts.forEach((p) => {
      if (!days.has(p.day_of_week)) days.set(p.day_of_week, []);
      days.get(p.day_of_week)!.push(p);
    });
    return days;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setView("calendar")}
          className={`text-xs font-mono uppercase px-3 py-1.5 rounded-lg transition-colors ${
            view === "calendar"
              ? "bg-[#E8FF5A]/10 text-[#E8FF5A]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setView("list")}
          className={`text-xs font-mono uppercase px-3 py-1.5 rounded-lg transition-colors ${
            view === "list"
              ? "bg-[#E8FF5A]/10 text-[#E8FF5A]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          List
        </button>
      </div>

      {weekEntries.length > 1 ? (
        <Tabs defaultValue={weekEntries[0]?.[0]} className="space-y-4">
          <TabsList className="bg-white/[0.03] border border-white/[0.06]">
            {weekEntries.map(([weekKey], i) => (
              <TabsTrigger
                key={weekKey}
                value={weekKey}
                className="text-xs font-mono data-[state=active]:bg-[#E8FF5A]/10 data-[state=active]:text-[#E8FF5A]"
              >
                Week {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {weekEntries.map(([weekKey, weekPosts]) => (
            <TabsContent key={weekKey} value={weekKey}>
              {view === "calendar" ? (
                <CalendarView
                  dayGroups={groupByDay(weekPosts)}
                  onRegenerateCopy={onRegenerateCopy}
                  regeneratingPostId={regeneratingPostId}
                />
              ) : (
                <ListView
                  posts={weekPosts}
                  onRegenerateCopy={onRegenerateCopy}
                  regeneratingPostId={regeneratingPostId}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : weekEntries.length === 1 ? (
        view === "calendar" ? (
          <CalendarView
            dayGroups={groupByDay(weekEntries[0][1])}
            onRegenerateCopy={onRegenerateCopy}
            regeneratingPostId={regeneratingPostId}
          />
        ) : (
          <ListView
            posts={weekEntries[0][1]}
            onRegenerateCopy={onRegenerateCopy}
            regeneratingPostId={regeneratingPostId}
          />
        )
      ) : null}
    </div>
  );
}

function CalendarView({
  dayGroups,
  onRegenerateCopy,
  regeneratingPostId,
}: {
  dayGroups: Map<number, CampaignPost[]>;
  onRegenerateCopy?: (postId: string) => void;
  regeneratingPostId?: string | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {[1, 2, 3, 4, 5, 6, 0].map((day) => (
        <div key={day} className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-gray-500 text-center pb-2 border-b border-white/[0.06]">
            {dayName(day)}
          </h4>
          {dayGroups.get(day)?.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onRegenerateCopy={onRegenerateCopy}
              isRegenerating={regeneratingPostId === post.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListView({
  posts,
  onRegenerateCopy,
  regeneratingPostId,
}: {
  posts: CampaignPost[];
  onRegenerateCopy?: (postId: string) => void;
  regeneratingPostId?: string | null;
}) {
  const sorted = [...posts].sort((a, b) => {
    const da = a.scheduled_date ?? "";
    const db = b.scheduled_date ?? "";
    return da.localeCompare(db) || (a.scheduled_time ?? "").localeCompare(b.scheduled_time ?? "");
  });

  return (
    <div className="space-y-3">
      {sorted.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onRegenerateCopy={onRegenerateCopy}
          isRegenerating={regeneratingPostId === post.id}
        />
      ))}
    </div>
  );
}
