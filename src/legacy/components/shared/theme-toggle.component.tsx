"use client";

import { useAtom } from "jotai";
import { Monitor, Moon, Sun } from "lucide-react";

import { useDictionary } from "#dictionary";
import IconButton from "#legacy/components/ui/icon-button.component";
import { cn } from "#legacy/helpers/tailwind.helper";
import { themeAtom } from "#legacy/theme/theme.atom";
import { getNextTheme } from "#lib/shared/theme/theme.helper";

const ThemeToggle = ({ className }: { className?: string }) => {
  const dictionary = useDictionary();
  const [, setTheme] = useAtom(themeAtom);
  return (
    <IconButton
      aria-label={dictionary.common.switchTheme}
      onClick={() => setTheme(getNextTheme)}
      className={cn("rounded-full", className)}
    >
      <Sun className="hidden h-5 w-5 in-data-[theme-preference=light]:block" />
      <Moon className="hidden h-5 w-5 in-data-[theme-preference=dark]:block" />
      <Monitor className="hidden h-5 w-5 in-data-[theme-preference=system]:block" />
    </IconButton>
  );
};

export default ThemeToggle;
