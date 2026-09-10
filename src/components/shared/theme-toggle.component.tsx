"use client";

import { useSetAtom } from "jotai";
import { Monitor, Moon, Sun } from "lucide-react";

import { themeAtom } from "#lib/client/theme.atom";
import { getNextTheme } from "#lib/shared/theme/theme.helper";
import { cn } from "#lib/shared/utils";

const ThemeToggle = ({ className }: { className?: string }) => {
  const setTheme = useSetAtom(themeAtom);
  return (
    <button
      type="button"
      onClick={() => setTheme(getNextTheme)}
      className={cn(
        "cursor-pointer rounded-full p-2 text-(--text-muted) transition-all hover:bg-(--surface-hover) hover:text-(--text-primary)",
        className,
      )}
    >
      <Sun className="hidden h-5 w-5 in-[.light]:block" />
      <Moon className="hidden h-5 w-5 in-[.dark]:block" />
      <Monitor className="hidden h-5 w-5 in-[.system]:block" />
    </button>
  );
};

export default ThemeToggle;
