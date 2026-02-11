"use client";

import { useState, useTransition } from "react";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Calendar,
  Copy,
  HardDrive,
  Trash2,
} from "lucide-react";

import LightboxImage from "@/components/LightboxImage";
import { type ImageFile, deleteImageClient } from "@/lib/data/dashboard-client";

type SortField = "createdAt" | "size";
type SortOrder = "asc" | "desc";

export default function ImageGallery({ images }: { images: ImageFile[] }) {
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sort images
  const sortedImages = [...images].sort((a, b) => {
    let comparison = 0;

    if (sortField === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortField === "size") {
      comparison = a.size - b.size;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleDelete = (image: ImageFile) => {
    if (!confirm(`Delete "${image.name}"?`)) return;
    startTransition(async () => {
      const { error } = await deleteImageClient(image.name);

      if (error) {
        setError(error || "Failed to delete image");
      }
    });
  };

  const handleCopyUrl = async (image: ImageFile) => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopiedId(image.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Failed to copy URL");
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const SortIcon = sortOrder === "asc" ? ArrowUpAZ : ArrowDownAZ;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort buttons */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
          <button
            onClick={() => toggleSort("createdAt")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sortField === "createdAt"
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Time
            {sortField === "createdAt" && <SortIcon className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => toggleSort("size")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sortField === "size"
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            <HardDrive className="h-4 w-4" />
            Size
            {sortField === "size" && <SortIcon className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Image count */}
        <div className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Images grid */}
      {sortedImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 py-12 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          <HardDrive className="mb-2 h-12 w-12 opacity-50" />
          <p>No images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedImages.map((image) => (
            <div key={image.id} className="group/card relative">
              <LightboxImage
                src={image.url}
                alt={image.name}
                actionRender={() => (
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover/lightbox:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(image);
                      }}
                      className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                        copiedId === image.id
                          ? "bg-green-500 text-white"
                          : "bg-zinc-700 text-white hover:bg-zinc-600"
                      }`}
                      title="Copy URL"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image);
                      }}
                      disabled={isPending}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              />

              {/* Image info overlay */}
              <div className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-lg bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover/card:opacity-100">
                <p
                  className="truncate text-xs text-white/90"
                  title={image.name}
                >
                  {image.name}
                </p>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>{formatSize(image.size)}</span>
                  <span>{formatDate(image.createdAt).split(",")[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
