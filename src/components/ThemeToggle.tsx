"use client";
import Cookies from "js-cookie";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle({ className }: { className?: string }) {
  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme: Theme = html.classList.contains("system")
      ? "system"
      : html.classList.contains("dark")
        ? "dark"
        : "light";

    // system -> light -> dark
    let nextTheme: Theme;
    if (currentTheme === "light") nextTheme = "dark";
    else if (currentTheme === "dark") nextTheme = "system";
    else nextTheme = "light";

    html.classList.remove("light", "dark", "system");
    html.classList.add(nextTheme);
    Cookies.set("theme", nextTheme, { expires: 365 });
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
