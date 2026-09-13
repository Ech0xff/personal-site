import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import { color, font, layer } from "#design/tokens.stylex";
const pulse = stylex.keyframes({
  "50%": {
    opacity: 0.5,
  },
});
const styles = stylex.create({
  column: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    zIndex: layer.loading,
  },
  container: {
    marginTop: "auto",
    marginRight: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
  container2: {
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.bold,
    letterSpacing: ".5em",
    color: color.text,
  },
});
export default function Loading() {
  return (
    <Stack y xstyle={styles.column}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.container2)}>LOADING</div>
      </div>
    </Stack>
  );
}
