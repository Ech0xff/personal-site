"use client";

import * as stylex from "@stylexjs/stylex";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { MODAL_ANCHOR } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font, space } from "#design/tokens.stylex";
const spin = stylex.keyframes({
  to: {
    rotate: "360deg",
  },
});
const styles = stylex.create({
  row: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: space.xl,
    width: space.xl,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    color: color.muted,
  },
  label: {
    color: color.muted,
  },
  column: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
  },
  row2: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: font.subtitle,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  column2: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
  },
});
interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  errorRender?: React.ReactNode;
  optActions?: React.ReactNode;
  xstyle?: StyleInput;
  loading?: boolean;
  error?: boolean;
  title: string;
}
export default function DashboardShell({
  children,
  xstyle,
  title,
  optActions,
  loading = false,
  error = false,
  errorRender,
  ...props
}: Props) {
  if (loading) {
    return (
      <Stack x xstyle={styles.row}>
        <Loader2 {...stylex.props(styles.icon)} />
      </Stack>
    );
  }
  if (error) {
    return (
      <Stack x xstyle={styles.row}>
        {errorRender ? (
          errorRender
        ) : (
          <span {...stylex.props(styles.label)}>
            An error occurred while loading data.
          </span>
        )}
      </Stack>
    );
  }
  return (
    <Stack
      y
      {...props}
      style={{
        anchorName: MODAL_ANCHOR.DASHBOARD,
      }}
      xstyle={[styles.column, xstyle]}
    >
      <Stack x xstyle={styles.row2}>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
        {optActions && <div>{optActions}</div>}
      </Stack>
      <Stack y xstyle={styles.column2}>
        {children}
      </Stack>
    </Stack>
  );
}
