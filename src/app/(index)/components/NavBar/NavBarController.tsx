"use client";
import { useEffect, useRef } from "react";

export default function NavBarController() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isScrolled = !entry.isIntersecting;
        if (isScrolledRef.current !== isScrolled) {
          isScrolledRef.current = isScrolled;
          document.documentElement.dataset.scrolled = isScrolled.toString();
        }
      },
      { threshold: [1.0], rootMargin: "0px" },
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sentinelRef}
      id="scroll-sentinel"
      className="pointer-events-none absolute top-0 right-0 left-0 -z-100 h-px"
    />
  );
}
