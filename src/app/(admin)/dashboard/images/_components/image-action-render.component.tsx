"use client";

import * as stylex from "@stylexjs/stylex";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import Stack from "#components/ui/stack.component";
import { lightbox } from "#design/interaction.stylex";
import { color, space, shape, motionToken } from "#design/tokens.stylex";
import type { ImageFile } from "#types";
const styles = stylex.create({
  row: {
    position: "absolute",
    top: space.xxs,
    right: space.xxs,
    gap: space.xxs,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":focus-within", lightbox)]: 1,
      [stylex.when.ancestor(":hover", lightbox)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  icon: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
  },
  icon2: {
    backgroundColor: color.successSurface,
    color: color.successText,
  },
  icon3: {
    backgroundColor: {
      default: color.text,
      ":hover": color.surfaceStrong,
    },
    color: color.inverse,
  },
  icon4: {
    height: space.sm,
    width: space.sm,
  },
  icon5: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
  },
});
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
      toast.success("URL copied successfully.", {
        id: toastId,
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL", {
        id: toastId,
      });
    }
  };
  return (
    <Stack x xstyle={styles.row}>
      <IconButton
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          void handleCopyUrl();
        }}
        xstyle={[styles.icon, copied ? styles.icon2 : styles.icon3, null]}
        title="Copy URL"
        aria-label="Copy URL"
      >
        <Copy {...stylex.props(styles.icon4)} />
      </IconButton>
      <IconButton
        size="sm"
        variant="danger"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image);
        }}
        disabled={isPending}
        xstyle={styles.icon5}
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 {...stylex.props(styles.icon4)} />
      </IconButton>
    </Stack>
  );
}
