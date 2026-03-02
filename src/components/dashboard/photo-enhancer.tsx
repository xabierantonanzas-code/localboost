"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, CheckCircle, XCircle, Image } from "lucide-react";
import type { Photo } from "@/types";

interface PhotoEnhancerProps {
  photos: Photo[];
  onUpload: (files: File[]) => void;
  onEnhance: (photoId: string) => void;
  isUploading?: boolean;
  enhancingPhotoId?: string | null;
}

export function PhotoEnhancer({
  photos,
  onUpload,
  onEnhance,
  isUploading,
  enhancingPhotoId,
}: PhotoEnhancerProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 10 * 1024 * 1024,
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-[#E8FF5A]" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Image className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-[#E8FF5A]/50 bg-[#E8FF5A]/[0.03]"
            : "border-white/[0.06] hover:border-white/20"
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-[#E8FF5A] mx-auto mb-4" />
        ) : (
          <Upload className="h-8 w-8 text-gray-500 mx-auto mb-4" />
        )}
        <p className="text-sm text-gray-400">
          {isDragActive
            ? "Drop your photos here..."
            : "Drag your photos here or click to select"}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          JPG, PNG, WebP up to 10MB
        </p>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
            >
              <div className="aspect-video bg-white/[0.02] flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.enhanced_url ?? photo.original_url}
                  alt={photo.original_filename ?? "Photo"}
                  className="w-full h-full object-cover"
                />
                {photo.enhancement_status === "processing" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#E8FF5A]" />
                  </div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {statusIcon(photo.enhancement_status)}
                  <span className="text-xs text-gray-400 truncate">
                    {photo.original_filename ?? "Photo"}
                  </span>
                </div>
                {photo.enhancement_status === "pending" && (
                  <Button
                    size="sm"
                    onClick={() => onEnhance(photo.id)}
                    disabled={enhancingPhotoId === photo.id}
                    className="h-7 text-xs bg-[#E8FF5A] text-black hover:bg-[#d4eb4a] shrink-0"
                  >
                    Enhance
                  </Button>
                )}
                {photo.enhancement_status === "completed" && (
                  <Badge className="bg-green-400/10 text-green-400 text-[10px] font-mono hover:bg-green-400/10">
                    Enhanced
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
