"use client";

import { ArrowDownAZ, ArrowUpAZ, Calendar, HardDrive } from "lucide-react";

import LightboxImage from "@/components/LightboxImage";
import { formatDate, formatSize } from "@/lib/shared/utils/tools";

import DashboardShell from "../components/ui/DashboardShell";
import ImageActionRender from "./components/ImageActionRender";
import { useHooks } from "./use-hooks";

export default function ImagesPage() {
  const {
    images,
    sortedImages,
    loading,
    error,
    removeImage,
    sortField,
    sortOrder,
    isPending,
    toggleSort,
    handleDelete,
  } = useHooks();

  const SortIcon = sortOrder === "asc" ? ArrowUpAZ : ArrowDownAZ;
  const totalSize = images.reduce((sum, image) => sum + image.size, 0);

  return (
    <DashboardShell title="Image Gallery" loading={loading} error={error}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
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
              {sortField === "createdAt" && (
                <SortIcon className="h-3.5 w-3.5" />
              )}
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

          <div className="ml-auto flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              {formatSize(totalSize)} total
            </span>
          </div>
        </div>

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
                    <ImageActionRender
                      isPending={isPending}
                      image={image}
                      onDelete={(selected) => handleDelete(selected, removeImage)}
                    />
                  )}
                />

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
    </DashboardShell>
  );
}
