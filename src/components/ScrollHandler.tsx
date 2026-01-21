"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollHandler() {
  const pathname = usePathname();
  useEffect(() => {
    const updateScrollStatus = () => {
      document.documentElement.dataset.scrolled = (
        window.scrollY > 0
      ).toString();
    };

    document.documentElement.dataset.home = (pathname === "/").toString();

    window.addEventListener("scroll", updateScrollStatus, { passive: true });
    updateScrollStatus();

    return () => window.removeEventListener("scroll", updateScrollStatus);
  }, [pathname]);

  return null;
}
