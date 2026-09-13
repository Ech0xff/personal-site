"use client";

import * as stylex from "@stylexjs/stylex";
import { Monitor, Moon, Sun } from "lucide-react";

import IconButton from "#components/ui/icon-button.component";
import type { StyleInput } from "#design/style.type";
import { shape } from "#design/tokens.stylex";
import { useThemePreference } from "#lib/client/theme/theme.hook";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";
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
  const [preference, setTheme] = useThemePreference();
  const labels = defaultDictionary.common.theme;
  const description = defaultDictionary.common.switchTheme
    .replace("{current}", labels[preference])
    .replace("{next}", labels[getNextTheme(preference)]);
  return (
    <IconButton
      aria-label={description}
      title={description}
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
