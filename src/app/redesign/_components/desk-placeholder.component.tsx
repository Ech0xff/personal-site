import * as stylex from "@stylexjs/stylex";

import { color, font, space } from "../_design/tokens.stylex";

const styles = stylex.create({
  root: {
    minHeight: "calc(100svh - 160px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.md,
    padding: space.lg,
    textAlign: "center",
  },
  title: {
    fontFamily: font.display,
    fontSize: "clamp(48px, 6vw, 80px)",
    fontWeight: font.regular,
    outline: "none",
  },
  message: { color: color.muted, fontSize: font.bodySize },
});
export function DeskPlaceholder({ title }: Readonly<{ title: string }>) {
  return (
    <section {...stylex.props(styles.root)}>
      <h1 tabIndex={-1} {...stylex.props(styles.title)}>
        {title}
      </h1>
      <p {...stylex.props(styles.message)}>Not implemented yet.</p>
    </section>
  );
}
