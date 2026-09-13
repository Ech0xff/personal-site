"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";

import {
  font,
  media,
  motionToken,
  shadow,
  shape,
  space,
} from "#design/tokens.stylex";

import { foundation } from "../_design/foundation.style";
import { feedback, objectMarker } from "../_design/object-feedback.stylex";
import { material } from "../_design/tokens.stylex";
import { DeskClock } from "./desk-clock.component";
import { terminalLines } from "./desk-content.const";
import { displayProgramAtom } from "./desk-preferences.atom";
import { displayPrograms } from "./display-content.const";
import { DisplayGuestbook } from "./display-guestbook.component";
import { DisplayProgramIcon } from "./display-program-icon.component";
import { DisplayStats } from "./display-stats.component";
import { useDisplayProgram } from "./use-display-program.hook";
import { useTypewriter } from "./use-typewriter.hook";

const blink = stylex.keyframes({
  "0%, 49%": { opacity: 1 },
  "50%, 100%": { opacity: 0 },
});
const scan = stylex.keyframes({
  "0%": { transform: "translateY(-10px)", opacity: 0 },
  "20%": { opacity: 0.18 },
  "100%": { transform: "translateY(300px)", opacity: 0 },
});
const styles = stylex.create({
  root: {
    position: "relative",
    width: "100%",
    borderRadius: "10px",
    padding: "13px",
    backgroundColor: material.casing,
    boxShadow: `inset 0 -4px 0 ${material.casingShade}, ${shadow.lifted}`,
    transform: {
      default: "rotate(-4deg)",
      ":hover": "rotate(0deg)",
      ":has(:focus-visible)": "rotate(0deg)",
      [media.reduce]: "rotate(-4deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  screen: {
    position: "relative",
    height: "360px",
    borderRadius: "5px",
    paddingInline: space.md,
    paddingTop: space.md,
    paddingBottom: "54px",
    backgroundColor: material.screen,
    backgroundImage: material.scans,
    color: material.phosphor,
    fontFamily: font.mono,
    fontSize: font.terminal,
    lineHeight: 1.65,
    boxShadow: shadow.inset,
  },
  prompt: {
    display: "block",
    fontSize: font.large,
    fontWeight: font.bold,
    opacity: 0.65,
  },
  controls: {
    borderWidth: 0,
    padding: 0,
    margin: 0,
    minWidth: 0,
    position: "absolute",
    right: space.sm,
    bottom: space.xs,
    display: "flex",
    alignItems: "center",
    gap: space.xxs,
  },
  button: {
    display: "grid",
    placeItems: "center",
    width: "32px",
    minWidth: 0,
    height: shape.touch,
    fontFamily: font.mono,
    fontSize: font.tiny,
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    borderRadius: shape.small,
    backgroundColor: "transparent",
    color: material.phosphor,
    opacity: { default: 0.7, ":hover": 1, ":disabled": 0.3 },
  },
  selected: {
    opacity: 1,
  },
  viewport: { position: "relative", height: "100%", overflow: "hidden" },
  panel: {
    height: "100%",
    overflow: "hidden",
    paddingRight: "2px",
    opacity: 1,
    transitionProperty: "opacity",
    transitionDuration: { default: "140ms", [media.reduce]: "0s" },
  },
  changing: { opacity: 0 },
  scan: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    backgroundColor: material.phosphor,
    pointerEvents: "none",
    animationName: { default: scan, [media.reduce]: "none" },
    animationDuration: "320ms",
    animationTimingFunction: "linear",
    opacity: 0,
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
export function RetroComputer() {
  const [program, setProgram] = useAtom(displayProgramAtom);
  const { displayed, changing } = useDisplayProgram(program);
  const writer = useTypewriter(program === "terminal");
  return (
    <section
      aria-label="Desk display"
      {...stylex.props(styles.root, objectMarker)}
    >
      <div ref={writer.element} {...stylex.props(styles.screen)}>
        <DeskClock />
        <div {...stylex.props(styles.viewport)}>
          <section
            id="display-program-panel"
            aria-labelledby={`display-${displayed}-button`}
            inert={changing}
            {...stylex.props(styles.panel, changing && styles.changing)}
          >
            {displayed === "terminal" ? (
              <>
                <span aria-hidden="true" {...stylex.props(styles.prompt)}>
                  &gt;_
                </span>
                <div aria-hidden="true" {...stylex.props(styles.text)}>
                  <span data-testid="terminal-text">{writer.text}</span>
                  <span
                    {...stylex.props(
                      styles.cursor,
                      writer.running && styles.blinking,
                    )}
                  />
                </div>
                <p {...stylex.props(foundation.srOnly)}>
                  {terminalLines.join(" ")}
                </p>
              </>
            ) : displayed === "stats" ? (
              <DisplayStats />
            ) : (
              <DisplayGuestbook />
            )}
          </section>
          <span
            key={program}
            aria-hidden="true"
            {...stylex.props(styles.scan)}
          />
        </div>
        <fieldset
          aria-label="Display programs"
          {...stylex.props(styles.controls)}
        >
          {displayPrograms.map((item) => (
            <button
              key={item.id}
              id={`display-${item.id}-button`}
              type="button"
              aria-label={item.label}
              title={item.label}
              aria-pressed={program === item.id}
              aria-controls="display-program-panel"
              onClick={() => setProgram(item.id)}
              {...stylex.props(
                styles.button,
                program === item.id && styles.selected,
                foundation.focus,
              )}
            >
              <DisplayProgramIcon program={item.id} />
            </button>
          ))}
        </fieldset>
      </div>
      <span {...stylex.props(feedback.frame)} aria-hidden="true">
        <span {...stylex.props(feedback.label)}>Display</span>
      </span>
    </section>
  );
}
