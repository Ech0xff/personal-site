import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";

import type { StyleInput } from "#design/style.type";
import { color, shape, space } from "#design/tokens.stylex";

import Stack from "./stack.component";
const styles = stylex.create({
  child: {
    padding: space.md,
  },
  column: {
    overflow: "hidden",
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
  },
});
interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  xstyle?: StyleInput;
  divide?: boolean;
}
export default function SectionCard({
  children,
  xstyle,
  divide,
  ...props
}: Props) {
  return (
    <Stack
      y
      childStyles={styles.child}
      xstyle={[styles.column, xstyle]}
      divide={divide}
      {...props}
    >
      {children}
    </Stack>
  );
}
