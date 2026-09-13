import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";

import type { StyleInput } from "#design/style.type";
import { color, shape, shadow } from "#design/tokens.stylex";
const styles = stylex.create({
  container: {
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
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
    color: color.text,
    boxShadow: shadow.panel,
  },
});
export default function ModalPanel({
  xstyle,
  ...props
}: ComponentPropsWithRef<"div"> & {
  xstyle?: StyleInput;
}) {
  return <div {...props} {...stylex.props([styles.container, xstyle])} />;
}
