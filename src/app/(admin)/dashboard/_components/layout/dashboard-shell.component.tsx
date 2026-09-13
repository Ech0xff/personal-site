"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";

import Loading from "#components/ui/loading.component";
import { MODAL_ANCHOR } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font } from "#design/tokens.stylex";
const styles = stylex.create({
  row: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: color.muted,
  },
  column: {
    position: "relative",
    minWidth: 0,
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
  },
  row2: {
    paddingTop: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: font.heading,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  column2: {
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
    return <Loading />;
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
