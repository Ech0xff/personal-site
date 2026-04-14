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
      className="inline-flex items-center gap-2 text-gray-500 text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-100"
      type="button"
    >
      <ArrowUp className="h-4 w-4" />
      Back to Top
    </button>
  );
}
