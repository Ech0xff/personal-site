"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import { Monitor, Moon, Sun } from "lucide-react";

import IconButton from "#components/ui/icon-button.component";
import type { StyleInput } from "#design/style.type";
import { shape } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { themeAtom } from "#lib/client/theme/theme.atom";
import { getNextTheme } from "#lib/shared/theme/theme.helper";
const styles = stylex.create({
  icon: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
  },
  sun: {
    display: {
      default: "none",
      ":is([data-theme-preference=light] *)": "block",
    },
    height: "20px",
    width: "20px",
  },
  moon: {
    display: {
      default: "none",
      ":is([data-theme-preference=dark] *)": "block",
    },
    height: "20px",
    width: "20px",
  },
  monitor: {
    display: {
      default: "none",
      ":is([data-theme-preference=system] *)": "block",
    },
    height: "20px",
    width: "20px",
  },
});
const ThemeToggle = ({ xstyle }: { xstyle?: StyleInput }) => {
  const dictionary = useDictionary();
  const [, setTheme] = useAtom(themeAtom);
  return (
    <IconButton
      aria-label={dictionary.common.switchTheme}
      onClick={() => setTheme(getNextTheme)}
      xstyle={[styles.icon, xstyle]}
    >
      <Sun {...stylex.props(styles.sun)} />
      <Moon {...stylex.props(styles.moon)} />
      <Monitor {...stylex.props(styles.monitor)} />
    </IconButton>
  );
};
export default ThemeToggle;
