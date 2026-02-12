"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { X } from "lucide-react";

type LightboxImage = {
  src: string;
  alt?: string;
};

type LightboxContextType = {
  open: (image: LightboxImage) => void;
  close: () => void;
};

const LightboxContext = createContext<LightboxContextType | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [currentImage, setCurrentImage] = useState<LightboxImage | null>(null);

  const open = useCallback((image: LightboxImage) => {
    setCurrentImage(image);
    document.body.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => {
    setCurrentImage(null);
    document.body.style.overflow = "";
  }, []);

  const contextValue = useMemo(() => ({ open, close }), [open, close]);

  return (
    <LightboxContext.Provider value={contextValue}>
      {children}

      {currentImage && (
        <div
          className="animate-in fade-in fixed inset-0 z-10000 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200"
          onClick={close}
        >
          {/* Close button */}
          <button
            onClick={close}
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
              src={currentImage.src}
              alt={currentImage.alt || "Lightbox image"}
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
};
