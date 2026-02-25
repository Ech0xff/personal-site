"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";

import { X } from "lucide-react";

type Image = {
  src: string;
  alt?: string;
};

export function ImageViewer({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<Image | null>(null);
  const open = useCallback((image: Image) => {
    setImage(image);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setImage(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const handleDelegatedClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>("[data-viewer-trigger]");
      if (!trigger) return;
      const { src, alt } = trigger.dataset;
      if (src) open({ src, alt });
    };

    document.addEventListener("click", handleDelegatedClick);

    return () => {
      document.removeEventListener("click", handleDelegatedClick);
    };
  }, [open]);

  return (
    <>
      {children}

      {image && (
        <div
          className="animate-in fixed inset-0 z-10000 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200"
          onClick={close}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Container */}
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image?.src}
              alt={image?.alt}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
