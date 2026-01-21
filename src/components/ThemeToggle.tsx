"use client"
import { Moon, Sun } from "lucide-react";
import Cookies from "js-cookie";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    if (nextIsDark) {
      document.documentElement.classList.add("dark");
      Cookies.set("theme", "dark", { expires: 365 });
    } else {
      document.documentElement.classList.remove("dark");
      Cookies.set("theme", "light", { expires: 365 });
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-theme-hover transition-colors"
    >
      <Sun className="w-5 h-5 hidden dark:block" />
      <Moon className="w-5 h-5 block dark:hidden" />
    </button>
  );
}
