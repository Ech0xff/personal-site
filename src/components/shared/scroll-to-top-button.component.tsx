"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
      type="button"
    >
      <ArrowUp className="h-4 w-4" />
      Back to Top
    </button>
  );
}
