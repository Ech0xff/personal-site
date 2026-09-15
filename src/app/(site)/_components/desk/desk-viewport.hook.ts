import { useEffect, useState, type RefObject } from "react";

import { deskBreakpoint, type Size } from "#lib/shared/desk/desk-layout.helper";
export function useDeskViewport(root: RefObject<HTMLElement | null>) {
  const [available, setAvailable] = useState({ width: 1440, height: 900 });
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const update = () =>
      setAvailable({
        width: element.clientWidth,
        height: Math.max(
          1,
          window.innerHeight -
            (document.querySelector("header")?.offsetHeight ?? 76),
        ),
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [root]);
  const breakpoint = deskBreakpoint(available.width);
  const width =
    breakpoint === "desktop"
      ? Math.max(1440, available.width)
      : available.width;
  const height =
    breakpoint === "desktop"
      ? Math.max(900, available.height)
      : breakpoint === "tablet"
        ? 1450
        : 2250;
  const viewport: Size = { width, height };
  return {
    viewport,
    breakpoint,
    available,
  };
}
