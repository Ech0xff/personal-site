import { useEffect, useRef } from "react";

const PIXELS_PER_SECOND = 28;

export function useTagMarquee(direction: "left" | "right") {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const row = track?.parentElement;
    if (!track || !row) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let distance = 0;
    let offset = 0;
    let frame = 0;
    let previousTime = 0;

    const measure = () => {
      const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
      distance = (track.getBoundingClientRect().width + gap) / 2;
    };
    measure();
    offset = direction === "right" ? -distance : 0;
    const paint = () => {
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    };
    paint();

    const tick = (time: number) => {
      const elapsed = Math.max(0, Math.min(time - previousTime, 64));
      previousTime = time;
      if (distance > 0) {
        offset +=
          ((direction === "left" ? -1 : 1) * PIXELS_PER_SECOND * elapsed) /
          1000;
        offset = (((offset % distance) + distance) % distance) - distance;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const stop = () => cancelAnimationFrame(frame);
    const resume = () => {
      stop();
      if (reducedMotion.matches || row.matches(":hover")) return;
      // Resume from the last painted position, without counting paused time.
      previousTime = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    row.addEventListener("mouseenter", stop);
    row.addEventListener("mouseleave", resume);
    reducedMotion.addEventListener("change", resume);
    resume();

    return () => {
      stop();
      observer.disconnect();
      row.removeEventListener("mouseenter", stop);
      row.removeEventListener("mouseleave", resume);
      reducedMotion.removeEventListener("change", resume);
    };
  }, [direction]);

  return trackRef;
}
