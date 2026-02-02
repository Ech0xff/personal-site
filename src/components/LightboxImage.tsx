"use client";

import { useState } from "react";

import { X } from "lucide-react";

interface LightboxImageProps {
  src: string;
  alt: string;
  actionRender?: () => React.ReactNode;
}

export default function LightboxImage({
  src,
  alt,
  actionRender,
}: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-all hover:border-zinc-300 dark:border-zinc-700/50 dark:bg-zinc-800 dark:hover:border-zinc-600">
        <button onClick={() => setIsOpen(true)} className="h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </button>

        {/* Action button */}
        {actionRender && (
          <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
            {actionRender()}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-1000 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
