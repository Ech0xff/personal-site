"use client";
import { ArrowDownAZ, ArrowUpAZ, Calendar, HardDrive } from "lucide-react";

import Button from "#components/ui/button.component";
import Image from "#components/ui/image.component";
import Stack from "#components/ui/stack.component";
import { formatTime } from "#lib/shared/utils/date.helper";
import { formatSize } from "#lib/shared/utils/file-size.helper";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import ImageActionRender from "./_components/image-action-render.component";
import { useImages } from "./_hooks/images.hook";

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
  } = useImages();

  const SortIcon = sortOrder === "asc" ? ArrowUpAZ : ArrowDownAZ;
  const totalSize = images.reduce((sum, image) => sum + image.size, 0);

  return (
    <DashboardShell title="Image Gallery" loading={loading} error={error}>
      <Stack y className="gap-4">
        <Stack x className="flex-wrap items-center gap-3">
          <Stack
            x
            className="items-center gap-2 rounded-lg border border-border-default bg-surface-muted p-1"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("createdAt")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortField === "createdAt"
                  ? "bg-surface-selected text-text-primary shadow  "
                  : "text-text-muted hover:text-text-secondary  "
              }`}
            >
              <Calendar className="h-4 w-4" />
              Time
              {sortField === "createdAt" && (
                <SortIcon className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("size")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortField === "size"
                  ? "bg-surface-selected text-text-primary shadow  "
                  : "text-text-muted hover:text-text-secondary  "
              }`}
            >
              <HardDrive className="h-4 w-4" />
              Size
              {sortField === "size" && <SortIcon className="h-3.5 w-3.5" />}
            </Button>
          </Stack>
          <Stack
            x
            className="ml-auto items-center gap-2 text-xs font-medium text-text-secondary"
          >
            <span className="rounded-full border border-border-default bg-surface-input px-2.5 py-1 shadow-sm">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
            <span className="rounded-full border border-border-default bg-surface-input px-2.5 py-1 shadow-sm">
              {formatSize(totalSize)} total
            </span>
          </Stack>
        </Stack>
        {sortedImages.length === 0 ? (
          <Stack
            y
            className="items-center justify-center rounded-lg border border-dashed border-border-strong py-12 text-text-muted"
          >
            <HardDrive className="mb-2 h-12 w-12 opacity-50" />
            <p>No images found</p>
          </Stack>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedImages.map((image) => (
              <div key={image.id} className="group/card relative">
                <Image
                  framed
                  src={image.url}
                  alt={image.name}
                  actionRender={() => (
                    <ImageActionRender
                      isPending={isPending}
                      image={image}
                      onDelete={(selected) =>
                        handleDelete(selected, removeImage)
                      }
                    />
                  )}
                />
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 rounded-b-lg bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-focus-within/card:opacity-100 group-hover/card:opacity-100">
                  <p
                    className="truncate text-xs text-primary-fg/90"
                    title={image.name}
                  >
                    {image.name}
                  </p>
                  <Stack
                    x
                    className="items-center justify-between text-xs text-primary-fg/70"
                  >
                    <span>{formatSize(image.size)}</span>
                    <span>{formatTime(image.createdAt, "MMM D, YYYY")}</span>
                  </Stack>
                </div>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </DashboardShell>
  );
}
