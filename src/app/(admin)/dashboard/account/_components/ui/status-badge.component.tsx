import * as stylex from "@stylexjs/stylex";
import { AlertTriangle, Check } from "lucide-react";

import { font, space, shape, color } from "#design/tokens.stylex";
const styles = stylex.create({
  state: {
    borderTopColor: color.successBorder,
    borderRightColor: color.successBorder,
    borderBottomColor: color.successBorder,
    borderLeftColor: color.successBorder,
    backgroundColor: color.successSurface,
    color: color.successText,
  },
  state2: {
    borderTopColor: color.dangerBorder,
    borderRightColor: color.dangerBorder,
    borderBottomColor: color.dangerBorder,
    borderLeftColor: color.dangerBorder,
    backgroundColor: color.dangerSurface,
    color: color.dangerText,
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    fontSize: font.control,
    lineHeight: 1.5,
  },
  icon: {
    height: space.md,
    width: space.md,
    flexShrink: 0,
  },
});
export default function StatusBadge({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const toneStyles = type === "success" ? styles.state : styles.state2;
  const Icon = type === "success" ? Check : AlertTriangle;
  return (
    <div {...stylex.props([styles.container, toneStyles])}>
      <Icon {...stylex.props(styles.icon)} />
      {message}
    </div>
  );
}
