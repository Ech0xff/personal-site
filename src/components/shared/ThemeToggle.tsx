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
        "cursor-pointer rounded-full p-2 text-zinc-500 transition-all hover:bg-theme-hover hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
        className,
      )}
    >
      <Sun className="in-[.light]:block hidden h-5 w-5" />
      <Moon className="in-[.dark]:block hidden h-5 w-5" />
      <Monitor className="in-[.system]:block hidden h-5 w-5" />
    </button>
  );
}
