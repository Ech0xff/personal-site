"use client";
import { Monitor, Moon, Sun } from "lucide-react";

import { toggleTheme } from "@/lib/client/theme";
import { cn } from "@/lib/shared/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const toggleHandler = () => toggleTheme();

  return (
    <button
      onClick={toggleHandler}
      className={cn(
        "hover:bg-theme-hover rounded-lg p-2 transition-colors",
        className,
      )}
    >
      <Sun className="hidden h-5 w-5 in-[.light]:block" />
      <Moon className="hidden h-5 w-5 in-[.dark]:block" />
      <Monitor className="hidden h-5 w-5 in-[.system]:block" />
    </button>
  );
}
