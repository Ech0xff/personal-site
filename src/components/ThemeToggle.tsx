"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import Cookies from "js-cookie";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
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
    if (nextTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.add(isDark ? "dark" : "light");
    }

    Cookies.set("theme", nextTheme, { expires: 365 });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-theme-hover transition-colors"
    >
      <Sun className="w-5 h-5 hidden group-[.light]:block group-[.system]:hidden" />
      <Moon className="w-5 h-5 hidden group-[.dark]:block group-[.system]:hidden" />
      <Monitor className="w-5 h-5 hidden group-[.system]:block" />
    </button>
  );
}
