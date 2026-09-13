"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import { Activity, type ReactNode } from "react";

import {
  font,
  media,
  motionToken,
  shadow,
  shape,
  space,
  material,
} from "#design/tokens.stylex";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { ObjectFeedback } from "../object-feedback.component";
import { DeskClock } from "./desk-clock.component";
import { displayPrograms } from "./display-content.const";
import type { DisplayProgram } from "./display-content.schema";
import { DisplayProgramIcon } from "./display-program-icon.component";
import { displayProgramAtom } from "./display.atom";

const scan = stylex.keyframes({
  "0%": { transform: "translateY(-10px)", opacity: 0 },
  "20%": { opacity: 0.1 },
  "100%": { transform: "translateY(300px)", opacity: 0 },
});
const enter = stylex.keyframes({
  from: { opacity: 0.35, transform: "translateY(3px)" },
  to: { opacity: 1, transform: "translateY(0)" },
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
  },
  program: {
    height: "100%",
    animationName: { default: enter, [media.reduce]: "none" },
    animationDuration: motionToken.displaySwitch,
  },
  scan: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    backgroundColor: material.phosphor,
    pointerEvents: "none",
    animationName: { default: scan, [media.reduce]: "none" },
    animationDuration: motionToken.displayScan,
    animationTimingFunction: "linear",
    opacity: 0,
  },
});
export function RetroComputer({
  programs,
}: Readonly<{ programs: Readonly<Record<DisplayProgram, ReactNode>> }>) {
  const [program, setProgram] = useAtom(displayProgramAtom);
  return (
    <section
      aria-label="Desk display"
      {...stylex.props(styles.root, objectMarker)}
    >
      <div {...stylex.props(styles.screen)}>
        <DeskClock />
        <div {...stylex.props(styles.viewport)}>
          <section
            id="display-program-panel"
            aria-labelledby={`display-${program}-button`}
            {...stylex.props(styles.panel)}
          >
            {displayPrograms.map(({ id }) => (
              <Activity key={id} mode={id === program ? "visible" : "hidden"}>
                <div {...stylex.props(styles.program)}>{programs[id]}</div>
              </Activity>
            ))}
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
      <ObjectFeedback label="Display" />
    </section>
  );
}
