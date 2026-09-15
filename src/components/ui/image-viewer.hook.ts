import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { lockScrolling } from "#lib/client/scroll/scroll-lock.service";
type Image = {
  src: string;
  alt?: string;
};
const MIN_SCALE = 25;
const MAX_SCALE = 300;
const SCALE_STEP = 25;
const VIEWPORT_PADDING = 32;
const CONTROLS_SPACE = 112;
export function useImageViewer() {
  const [image, setImage] = useState<Image | null>(null);
  const [scale, setScale] = useState(100);
  const [fitWidth, setFitWidth] = useState<number>();
  const dialogRef = useRef<HTMLDialogElement>(null);
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
  }, []);
  const close = useCallback(() => {
    setImage(null);
  }, []);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!image || !dialog) return;
    const unlock = lockScrolling(document.body);
    dialog.showModal();
    return () => {
      dialog.close();
      unlock();
    };
  }, [image]);
  useEffect(() => {
    const handleDelegatedClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const dialog = dialogRef.current;
      if (dialog?.open && dialog.contains(target)) {
        if (!target.closest("[data-viewer-control]")) close();
        return;
      }
      const trigger = target.closest<HTMLElement>("[data-viewer-trigger]");
      if (!trigger) return;
      const { src, alt } = trigger.dataset;
      if (src)
        open({
          src,
          alt,
        });
    };
    document.addEventListener("click", handleDelegatedClick);
    return () => {
      document.removeEventListener("click", handleDelegatedClick);
    };
  }, [open, close]);
  return {
    image,
    scale,
    fitWidth,
    dialogRef,
    canZoomOut,
    canZoomIn,
    updateScale,
    fitImageToViewport,
    close,
    scaleStep: SCALE_STEP,
  };
}
