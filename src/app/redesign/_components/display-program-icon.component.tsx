import * as stylex from "@stylexjs/stylex";

import type { DisplayProgram } from "./display-content.schema";

const styles = stylex.create({
  icon: {
    width: "18px",
    height: "18px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});
const paths = {
  terminal: "m4 6 5 5-5 5m9 1h7",
  stats: "M4 19V5m0 14h16M8 15v-4m5 4V7m5 8V3",
  guestbook: "M5 4h14v13H9l-4 3V4Zm4 5h6m-6 4h4",
} satisfies Record<DisplayProgram, string>;

export function DisplayProgramIcon({
  program,
}: Readonly<{ program: DisplayProgram }>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stylex.props(styles.icon)}>
      <path d={paths[program]} />
    </svg>
  );
}
