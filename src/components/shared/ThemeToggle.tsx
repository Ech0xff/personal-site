"use client";
import { Monitor, Moon, Sun } from "lucide-react";

import { toggleTheme } from "@/lib/client/theme";
import { cn } from "@/lib/shared/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const toggleHandler = () => toggleTheme();

  return (
    <button
      type="button"
      onClick={toggleHandler}
      className={cn(
        "rounded-lg p-2 transition-colors hover:bg-theme-hover",
        className,
      )}
    >
      <Sun className="in-[.light]:block hidden h-5 w-5" />
      <Moon className="in-[.dark]:block hidden h-5 w-5" />
      <Monitor className="in-[.system]:block hidden h-5 w-5" />
    </button>
  );
}
