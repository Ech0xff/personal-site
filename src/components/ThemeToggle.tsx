"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const applyThemeToDOM = (selectedTheme: Theme) => {
  if (selectedTheme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else if (selectedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = (Cookies.get("theme") || "system") as Theme;
      applyThemeToDOM(savedTheme);
      return savedTheme;
    }
    return "system";
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentTheme = Cookies.get("theme");
      if (currentTheme === "system" || !currentTheme) {
        applyThemeToDOM("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    setTheme(nextTheme);
    Cookies.set("theme", nextTheme, { expires: 365 });
    applyThemeToDOM(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-theme-hover transition-colors"
      title={`Current theme: ${
        theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"
      }`}
    >
      {getIcon()}
    </button>
  );
}
