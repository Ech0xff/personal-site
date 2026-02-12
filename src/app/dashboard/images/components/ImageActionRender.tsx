"use client";

import { useState } from "react";

import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ImageFile } from "@/types";

interface ImageActionButtonsProps {
  image: ImageFile;
  isPending: boolean;
  onDelete: (image: ImageFile) => void;
}

export default function ImageActionRender({
  image,
  isPending,
  onDelete,
}: ImageActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    const toastId = toast.loading("Copying URL...");
    try {
      await navigator.clipboard.writeText(image.url);
      toast.success("URL copied successfully.", { id: toastId });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL", { id: toastId });
    }
  };

  return (
    <div className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover/lightbox:opacity-100">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleCopyUrl();
        }}
        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
          copied
            ? "bg-green-500 text-white"
            : "bg-zinc-700 text-white hover:bg-zinc-600"
        }`}
        title="Copy URL"
      >
        <Copy className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image);
        }}
        disabled={isPending}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
