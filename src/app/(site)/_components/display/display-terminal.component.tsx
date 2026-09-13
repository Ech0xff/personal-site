"use client";
import * as stylex from "@stylexjs/stylex";

import { font, material, media, space } from "#design/tokens.stylex";

import { foundation } from "../../_design/foundation.style";
import { terminalLines } from "./terminal.const";
import { useTypewriter } from "./use-typewriter.hook";
const blink = stylex.keyframes({
  "0%, 49%": { opacity: 1 },
  "50%, 100%": { opacity: 0 },
});
const styles = stylex.create({
  root: { height: "100%" },
  prompt: {
    display: "block",
    fontSize: font.large,
    fontWeight: font.bold,
    opacity: 0.65,
  },
  text: {
    whiteSpace: "pre-wrap",
    paddingTop: space.sm,
    paddingRight: space.xxs,
  },
  cursor: {
    display: "inline-block",
    width: "8px",
    height: "15px",
    verticalAlign: "middle",
    backgroundColor: material.phosphor,
    marginLeft: "2px",
  },
  blinking: {
    animationDuration: "1s",
    animationTimingFunction: "steps(1)",
    animationIterationCount: "infinite",
    animationName: { default: blink, [media.reduce]: "none" },
  },
});
export function DisplayTerminal() {
  const writer = useTypewriter();
  return (
    <div ref={writer.element} {...stylex.props(styles.root)}>
      <>
        <span aria-hidden="true" {...stylex.props(styles.prompt)}>
          &gt;_
        </span>
        <div aria-hidden="true" {...stylex.props(styles.text)}>
          <span data-testid="terminal-text">{writer.text}</span>
          <span
            {...stylex.props(styles.cursor, writer.running && styles.blinking)}
          />
        </div>
        <p {...stylex.props(foundation.srOnly)}>{terminalLines.join(" ")}</p>
      </>
    </div>
  );
}
