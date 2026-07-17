"use client";

import { Minus, Plus } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

type Image = {
  src: string;
  alt?: string;
};

const MIN_SCALE = 25;
const MAX_SCALE = 300;
const SCALE_STEP = 25;
const VIEWPORT_PADDING = 32;
const CONTROLS_SPACE = 112;

export function ImageViewer({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<Image | null>(null);
  const [scale, setScale] = useState(100);
  const [fitWidth, setFitWidth] = useState<number>();
  const canZoomOut = scale > MIN_SCALE;
  const canZoomIn = scale < MAX_SCALE;

  const updateScale = (nextScale: number) => {
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale)));
  };

  const fitImageToViewport = (imageElement: HTMLImageElement) => {
    const availableWidth = window.innerWidth - VIEWPORT_PADDING;
    const availableHeight =
      window.innerHeight - VIEWPORT_PADDING - CONTROLS_SPACE;
    const widthScale = availableWidth / imageElement.naturalWidth;
    const heightScale = availableHeight / imageElement.naturalHeight;
    const fittedScale = Math.min(widthScale, heightScale, 1) * 100;

    setFitWidth(
      Math.max(1, Math.floor(imageElement.naturalWidth * (fittedScale / 100))),
    );
    setScale(100);
  };

  const open = useCallback((image: Image) => {
    setScale(100);
    setFitWidth(undefined);
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
          className="animate-in fixed inset-0 z-10000 bg-black/90 backdrop-blur-sm duration-200"
          onClick={close}
        >
          <div
            className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center overflow-hidden rounded-md border border-zinc-700 bg-zinc-950/95 text-white shadow-lg shadow-black/40 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Zoom out"
              disabled={!canZoomOut}
              onClick={() => updateScale(scale - SCALE_STEP)}
            >
              <Minus className="size-5" />
            </button>
            <span className="min-w-14 px-1 text-center text-sm font-medium tabular-nums">
              {scale}%
            </span>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Zoom in"
              disabled={!canZoomIn}
              onClick={() => updateScale(scale + SCALE_STEP)}
            >
              <Plus className="size-5" />
            </button>
          </div>

          <div className="h-dvh w-dvw overflow-auto p-4 pb-24">
            <div className="flex min-h-full w-max min-w-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image?.src}
                alt={image?.alt}
                style={
                  fitWidth ? { width: `${(fitWidth * scale) / 100}px` } : {}
                }
                className="h-auto max-w-none object-contain shadow-2xl"
                onLoad={(event) => fitImageToViewport(event.currentTarget)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
