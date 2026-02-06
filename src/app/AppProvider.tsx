"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import Cookies from "js-cookie";

type Theme = "light" | "dark" | "system";

type AppUIContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const AppUIContext = createContext<AppUIContextValue | undefined>(undefined);

const getThemeFromDocument = (): Theme => {
  if (typeof document === "undefined") return "system";
  const html = document.documentElement;
  if (html.classList.contains("system")) return "system";
  if (html.classList.contains("dark")) return "dark";
  return "light";
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>(() => getThemeFromDocument());

  useEffect(() => {
    document.documentElement.dataset.home = (pathname === "/").toString();
  }, [pathname]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("light", "dark", "system");
    html.classList.add(theme);
    Cookies.set("theme", theme, { expires: 365 });
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>
  );
}

export const useAppUI = () => {
  const context = useContext(AppUIContext);
  if (!context) {
    throw new Error("useAppUI must be used within AppProvider");
  }
  return context;
};

export type { Theme };
