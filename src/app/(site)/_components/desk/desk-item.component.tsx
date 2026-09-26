import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import type { DeskItem } from "#lib/shared/desk/desk-configuration.schema";

import { itemStyles as styles } from "./desk-item.style";

export function DeskItemFrame({
  item,
  children,
}: Readonly<{ item: DeskItem; children: ReactNode }>) {
  const decorative = item.type === "coffee" || item.type === "pencil";
  return (
    <div
      data-desk-item={item.type}
      aria-hidden={decorative || undefined}
      {...stylex.props(styles.root, styles[item.type])}
    >
      {children}
    </div>
  );
}
