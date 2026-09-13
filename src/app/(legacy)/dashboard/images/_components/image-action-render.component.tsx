"use client";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import Stack from "#components/ui/stack.component";
import type { ImageFile } from "#types";

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
    <Stack
      x
      className="absolute top-1 right-1 gap-1 opacity-0 transition-opacity group-focus-within/lightbox:opacity-100 group-hover/lightbox:opacity-100"
    >
      <IconButton
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          void handleCopyUrl();
        }}
        className={`rounded-full ${
          copied
            ? "bg-success-bg text-success-text"
            : "bg-surface-inverse text-text-inverse hover:bg-surface-hover-strong"
        }`}
        title="Copy URL"
        aria-label="Copy URL"
      >
        <Copy className="h-3 w-3" />
      </IconButton>
      <IconButton
        size="sm"
        variant="danger"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image);
        }}
        disabled={isPending}
        className="rounded-full"
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="h-3 w-3" />
      </IconButton>
    </Stack>
  );
}
