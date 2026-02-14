"use client";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/shared/utils";
import { useAppUI } from "@/providers/AppProvider";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useAppUI();

  const toggleTheme = () => {
    // system -> light -> dark
    let nextTheme: typeof theme;
    if (theme === "light") nextTheme = "dark";
    else if (theme === "dark") nextTheme = "system";
    else nextTheme = "light";
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "hover:bg-theme-hover rounded-lg p-2 transition-colors",
        className,
      )}
    >
      <Sun className="hidden h-5 w-5 group-[.light]:block" />
      <Moon className="hidden h-5 w-5 group-[.dark]:block" />
      <Monitor className="hidden h-5 w-5 group-[.system]:block" />
    </button>
  );
}
