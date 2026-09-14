import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import { contentShellStyles as styles } from "./content-shell.style";

export function ContentShell({
  as: Element = "section",
  id,
  children,
}: Readonly<{ as?: "section" | "article"; id?: string; children: ReactNode }>) {
  return (
    <Element id={id} {...stylex.props(styles.root)}>
      {children}
    </Element>
  );
}
