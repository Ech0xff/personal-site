"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import Stack from "@/components/ui/Stack";
import { cn } from "@/lib/shared/utils/tailwind";

function NavbarController() {
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

export default function LayoutClient({
  children,
  navbar,
}: {
  children: React.ReactNode;
  navbar?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = /^\/[^/]*\/?$/.test(pathname);
  return (
    <>
      <NavbarController />
      <Stack y className={cn("relative min-h-dvh w-dvw duration-300")}>
        <Stack
          className={cn(
            "sticky top-0 z-1000 duration-300",
            "in-data-[scrolled=true]:backdrop-blur-md",
            isHome
              ? "in-data-[scrolled=true]:*:px-(--layout-padding-x)"
              : "px-(--layout-padding-x)",
          )}
        >
          {navbar}
          <div
            className={cn(
              "mx-auto h-px duration-300",
              isHome
                ? "in-data-[scrolled=true]:bg-[#d4d4d8] dark:in-data-[scrolled=true]:bg-[#52525b]"
                : "bg-[#d4d4d8] dark:bg-[#52525b]",
            )}
          />
        </Stack>
        <Stack
          y
          className={cn(
            "flex-1 duration-300",
            "in-data-[scrolled=true]:px-(--layout-padding-x)",
            { "px-(--layout-padding-x)": !isHome },
          )}
        >
          {children}
        </Stack>
      </Stack>
    </>
  );
}
