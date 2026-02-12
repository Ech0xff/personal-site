"use client";
import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils/tailwind";
import { useLightbox } from "@/providers/LightboxProvider";

interface Props extends ComponentPropsWithoutRef<"div"> {
  src?: string;
  alt?: string;
  actionRender?: () => React.ReactNode;
  className?: string;
}

export default function LightboxImage({
  src,
  alt,
  actionRender,
  className,
  ...props
}: Props) {
  const { open } = useLightbox();

  return (
    <>
      {/* Thumbnail */}
      <div
        {...props}
        className={cn(
          "group/lightbox relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-all hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-zinc-600",
          className,
        )}
      >
        <button
          onClick={() => open({ src: src || "", alt })}
          className="h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/lightbox:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover/lightbox:bg-black/10" />
        </button>

        {/* Action button */}
        {actionRender && actionRender()}
      </div>
    </>
  );
}
