"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";

import { MODAL_ANCHOR } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font } from "#design/tokens.stylex";
const styles = stylex.create({
  root: {
    position: "relative",
    minWidth: 0,
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
  },
  header: {
    paddingTop: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: font.heading,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  content: {
    paddingTop: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
  },
});
interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  actions?: React.ReactNode;
  xstyle?: StyleInput;
  title: string;
}
export default function DashboardShell({
  children,
  xstyle,
  title,
  actions,
  ...props
}: Props) {
  return (
    <Stack
      y
      {...props}
      style={{
        anchorName: MODAL_ANCHOR.DASHBOARD,
      }}
      xstyle={[styles.root, xstyle]}
    >
      <Stack x xstyle={styles.header}>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
        {actions && <div>{actions}</div>}
      </Stack>
      <Stack y xstyle={styles.content}>
        {children}
      </Stack>
    </Stack>
  );
}
