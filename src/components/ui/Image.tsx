import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils/tailwind";

interface Props extends ComponentPropsWithoutRef<"div"> {
  /** Image source URL. */
  src?: string;
  /** Accessible image description. */
  alt?: string;
  /** Optional controls rendered over the image container. */
  actionRender?: () => React.ReactNode;
  /** Class name for the outer image container. */
  className?: string;
  /** Image object-fit mode. */
  fit?: "cover" | "contain";
  /** Shows a hover dim overlay when enabled. Disabled by default. */
  overlay?: boolean;
  /** Thumbnail keeps a square frame; fluid uses the image's natural ratio. */
  variant?: "thumbnail" | "fluid";
  /** Enables the default framed thumbnail surface. Disabled by default. */
  framed?: boolean;
}

export default function Image({
  src,
  alt,
  actionRender,
  className,
  fit = "cover",
  overlay = false,
  variant = "thumbnail",
  framed = false,
  ...props
}: Props) {
  const isFluid = variant === "fluid";

  return (
    <div
      {...props}
      className={cn(
        "group/lightbox relative w-full transition-all",
        framed
          ? "rounded-lg border border-zinc-200 bg-zinc-100 hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-zinc-600"
          : "rounded-none border-none bg-transparent",
        isFluid ? "" : "aspect-square",
        "overflow-hidden",
        className,
      )}
    >
      <button
        type="button"
        data-viewer-trigger
        data-src={src}
        data-alt={alt}
        className={cn(
          "cursor-pointer",
          isFluid ? "block min-w-full" : "h-full w-full",
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            isFluid ? "block h-auto max-w-none" : "block h-full w-full",
            isFluid ? "w-full max-w-full" : "",
            fit === "contain" ? "object-contain" : "object-cover",
            isFluid
              ? ""
              : "transition-transform duration-300 group-hover/lightbox:scale-105",
          )}
          loading="lazy"
        />
        {overlay ? (
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover/lightbox:bg-black/10" />
        ) : null}
      </button>

      {actionRender?.()}
    </div>
  );
}
