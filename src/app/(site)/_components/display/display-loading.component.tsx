import * as stylex from "@stylexjs/stylex";

import Loading from "#components/ui/loading.component";
import { material, space } from "#design/tokens.stylex";
const styles = stylex.create({
  root: {
    height: "100%",
    minHeight: 0,
    padding: space.md,
    color: material.phosphor,
  },
});
export function DisplayLoading() {
  return <Loading tone="inherit" xstyle={styles.root} />;
}
