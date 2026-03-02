"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/stores/app-store";
import { useSubscription } from "@/hooks/use-subscription";
import { PhotoEnhancer } from "@/components/dashboard/photo-enhancer";
import { UsageMeter } from "@/components/dashboard/usage-meter";
import { LoadingState } from "@/components/shared/loading-state";
import { toast } from "sonner";
import type { Photo } from "@/types";

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [enhancingPhotoId, setEnhancingPhotoId] = useState<string | null>(null);
  const { activeBusiness, completeStep } = useAppStore();
  const { profile, limits } = useSubscription();
  const supabase = createClient();

  const loadPhotos = useCallback(async () => {
    if (!activeBusiness) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("photos")
      .select("*")
      .eq("business_id", activeBusiness.id)
      .order("created_at", { ascending: false });
    if (data) {
      setPhotos(data as Photo[]);
      if ((data as Photo[]).some((p: Photo) => p.enhancement_status === "completed")) {
        completeStep(5);
      }
    }
    setLoading(false);
  }, [activeBusiness, supabase, completeStep]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  async function handleUpload(files: File[]) {
    if (!activeBusiness) {
      toast.error("Please set up your business first");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setIsUploading(true);

    for (const file of files) {
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("photos-original")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("photos-original").getPublicUrl(filePath);

      await supabase.from("photos").insert({
        business_id: activeBusiness.id,
        user_id: user.id,
        original_url: publicUrl,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        enhancement_status: "pending",
      });
    }

    setIsUploading(false);
    toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} uploaded!`);
    await loadPhotos();
  }

  async function handleEnhance(photoId: string) {
    setEnhancingPhotoId(photoId);

    try {
      const res = await fetch("/api/photos/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Photo enhanced!");
      completeStep(5);
    } catch {
      toast.error("Failed to enhance photo");
    } finally {
      setEnhancingPhotoId(null);
      await loadPhotos();
    }
  }

  if (loading) return <LoadingState message="Loading photos..." />;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Photo Enhancement</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload and enhance your business photos with AI.
        </p>
      </div>

      <div className="mb-6 max-w-xs">
        <UsageMeter
          label="Photos enhanced this month"
          used={profile?.photos_used_this_month ?? 0}
          limit={limits.photos}
        />
      </div>

      <PhotoEnhancer
        photos={photos}
        onUpload={handleUpload}
        onEnhance={handleEnhance}
        isUploading={isUploading}
        enhancingPhotoId={enhancingPhotoId}
      />
    </div>
  );
}
