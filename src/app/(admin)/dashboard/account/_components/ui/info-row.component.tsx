import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import { color, font, space } from "#design/tokens.stylex";
const styles = stylex.create({
  label: {
    width: "144px",
    flexShrink: 0,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.muted,
  },
  label2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.text,
  },
  label3: {
    fontFamily: font.mono,
    fontSize: font.small,
    lineHeight: 1.5,
  },
  column: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
    gap: {
      default: space.xxs,
      "@media (min-width: 640px)": space.md,
    },
    alignItems: {
      default: null,
      "@media (min-width: 640px)": "center",
    },
  },
  layout1: {
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
  },
});
export default function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <Stack y xstyle={[styles.column, styles.layout1]}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <span
        {...stylex.props([styles.label2, mono ? styles.label3 : null, null])}
      >
        {value || "—"}
      </span>
    </Stack>
  );
}
