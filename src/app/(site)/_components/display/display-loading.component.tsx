import * as stylex from "@stylexjs/stylex";

import { material, space } from "#design/tokens.stylex";
const styles = stylex.create({
  root: {
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: space.md,
    color: material.phosphor,
  },
});
export function DisplayLoading() {
  return <output {...stylex.props(styles.root)}>Loading…</output>;
}
