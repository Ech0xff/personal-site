"use client";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { foundation } from "../_design/foundation.style";
import {
  color,
  font,
  light,
  material,
  media,
  palette,
  shadow,
  shape,
  space,
} from "../_design/tokens.stylex";
import { DeskLink } from "./desk-navigation.component";
import { Magnetic } from "./magnetic.component";
import { lampOff } from "./reading-desk.style";
const styles = stylex.create({
  root: {
    maxWidth: "1100px",
    paddingTop: { default: space.xxl, [media.phone]: space.xl },
    paddingInline: { default: space.xxl, [media.phone]: space.lg },
    paddingBottom: { default: space.section, [media.phone]: space.xl },
    marginInline: "auto",
  },
  title: {
    fontFamily: font.display,
    fontSize: { default: "64px", [media.phone]: "42px" },
    fontWeight: font.regular,
    letterSpacing: "-0.04em",
    marginBlock: space.lg,
    outline: "none",
  },
  intro: {
    fontSize: font.bodySize,
    color: color.muted,
    lineHeight: 1.9,
    maxWidth: "640px",
  },
  section: {
    marginTop: space.xxl,
    paddingTop: space.xl,
    borderTopWidth: shape.fine,
    borderTopStyle: "solid",
    borderTopColor: color.line,
  },
  heading: {
    fontFamily: font.display,
    fontSize: "30px",
    fontWeight: font.regular,
    marginBottom: space.lg,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(4,1fr)",
      [media.compact]: "repeat(2,1fr)",
    },
    gap: space.md,
  },
  swatch: {
    height: "90px",
    borderRadius: shape.control,
    borderWidth: shape.fine,
    borderStyle: "solid",
    borderColor: color.line,
    marginBottom: space.sm,
  },
  cream: { backgroundColor: palette.cream },
  ink: { backgroundColor: palette.ink },
  terracotta: { backgroundColor: palette.terracotta },
  olive: { backgroundColor: palette.olive },
  curtain: { backgroundColor: color.curtain },
  curtainText: { backgroundColor: color.curtainText },
  detail: {
    fontFamily: font.mono,
    fontSize: font.small,
    color: color.muted,
    lineHeight: 1.8,
  },
  typeDisplay: {
    fontFamily: font.display,
    fontSize: "40px",
    marginBottom: space.md,
  },
  typeArtistic: {
    fontFamily: font.handwritten,
    fontSize: "48px",
    marginBottom: space.md,
  },
  typeCode: {
    fontFamily: font.mono,
    fontStyle: "normal",
    fontSize: "20px",
    marginRight: space.md,
  },
  typeDesign: {
    fontFamily: font.artistic,
    fontStyle: "italic",
    fontSize: "30px",
  },
  typeSignature: {
    fontFamily: font.signature,
    fontSize: "24px",
    fontStyle: "italic",
    marginBottom: space.md,
  },
  typeBody: {
    fontFamily: font.body,
    fontSize: font.bodySize,
    marginBottom: space.md,
  },
  typeMono: { fontFamily: font.mono, fontSize: font.small },
  row: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.lg,
  },
  sample: {
    padding: space.lg,
    borderRadius: shape.control,
    backgroundColor: color.surface,
    minHeight: "110px",
    display: "grid",
    placeItems: "center",
    fontFamily: font.mono,
    fontSize: font.small,
  },
  contact: { boxShadow: shadow.contact },
  lifted: { boxShadow: shadow.lifted },
  inset: { boxShadow: shadow.inset },
  book: { backgroundColor: material.book, color: material.bookInk },
  vinyl: {
    backgroundColor: material.vinyl,
    backgroundImage: `repeating-radial-gradient(circle,transparent 0 3px,${material.grooves} 4px,transparent 5px)`,
    color: color.inverse,
  },
  crt: {
    backgroundColor: material.screen,
    color: material.phosphor,
    textShadow: `0 0 8px ${material.phosphor}`,
    boxShadow: shadow.inset,
  },
  glow: { backgroundColor: color.surface, position: "relative" },
  glowSurface: {
    position: "absolute",
    inset: 0,
    borderRadius: shape.control,
    backgroundImage: `radial-gradient(${material.glow},transparent)`,
    opacity: light.glowOpacity,
  },
  spacing: (size: string) => ({
    width: size,
    height: "20px",
    backgroundColor: color.accent,
    borderRadius: "2px",
  }),
  spacingRow: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    marginBottom: space.sm,
  },
});
export function DesignSystem() {
  const [lit, setLit] = useState(true);
  return (
    <div {...stylex.props(styles.root)}>
      <DeskLink
        href="/"
        {...stylex.props(foundation.eyebrow, foundation.focus)}
      >
        ← BACK TO THE DESK
      </DeskLink>
      <h1 tabIndex={-1} {...stylex.props(styles.title)}>
        The little details.
      </h1>
      <p {...stylex.props(styles.intro)}>
        A living guide to the little nest. Built with StyleX: foundations become
        semantic tokens, and semantic tokens become objects you can almost
        touch. Every sample below uses the same tokens as the desk.
      </p>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>A warm palette</h2>
        <div {...stylex.props(styles.grid)}>
          {[
            {
              name: "Cream → canvas",
              value: "color.canvas",
              style: styles.cream,
            },
            { name: "Ink → text", value: "color.text", style: styles.ink },
            {
              name: "Terracotta → accent",
              value: "color.accent",
              style: styles.terracotta,
            },
            {
              name: "Olive → book cloth",
              value: "material.book",
              style: styles.olive,
            },
            {
              name: "Soft stone → curtain",
              value: "color.curtain",
              style: styles.curtain,
            },
            {
              name: "Neutral ink → greeting",
              value: "color.curtainText",
              style: styles.curtainText,
            },
          ].map((item) => (
            <div key={item.name}>
              <div {...stylex.props(styles.swatch, item.style)} />
              <p {...stylex.props(styles.detail)}>
                {item.name}
                <br />
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Words with character</h2>
        <p {...stylex.props(styles.typeDisplay)}>
          A curious mind. A work in progress.
        </p>
        <p {...stylex.props(styles.typeArtistic)}>I’m Ech0xff.</p>
        <p {...stylex.props(styles.typeSignature)}>
          <span {...stylex.props(styles.typeCode)}>code by ech0xff</span>
          <span {...stylex.props(styles.typeDesign)}>design</span>
        </p>
        <p {...stylex.props(styles.typeBody)}>
          System sans for comfortable reading and clear controls.
        </p>
        <p {...stylex.props(styles.typeMono)}>
          Monospace for labels, notes, and a little terminal.
        </p>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Room to breathe</h2>
        <div>
          {[
            { name: "xxs", value: space.xxs },
            { name: "xs", value: space.xs },
            { name: "sm", value: space.sm },
            { name: "md", value: space.md },
            { name: "lg", value: space.lg },
            { name: "xl", value: space.xl },
            { name: "xxl", value: space.xxl },
            { name: "section", value: space.section },
          ].map(({ name, value }) => (
            <div key={name} {...stylex.props(styles.spacingRow)}>
              <span {...stylex.props(styles.detail)}>{name}</span>
              <span {...stylex.props(styles.spacing(value))} />
            </div>
          ))}
        </div>
        <p {...stylex.props(styles.detail)}>
          4 · 8 · 12 · 16 · 24 · 32 · 48 · 80 px. Phone ≤600, tablet 601–1023,
          desktop ≥1024.
        </p>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>A sense of touch</h2>
        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.sample, styles.contact)}>Contact</div>
          <div {...stylex.props(styles.sample, styles.lifted)}>Lifted</div>
          <div {...stylex.props(styles.sample, styles.book)}>Book cloth</div>
          <div {...stylex.props(styles.sample, styles.vinyl)}>
            Vinyl grooves
          </div>
          <div {...stylex.props(styles.sample, styles.crt)}>hello, world_</div>
          <div {...stylex.props(styles.sample, styles.inset)}>Inset</div>
        </div>
      </section>
      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.heading)}>Small interactions</h2>
        <div {...stylex.props(styles.row)}>
          <button
            type="button"
            {...stylex.props(foundation.control, foundation.focus)}
            onClick={() => setLit((value) => !value)}
            aria-pressed={lit}
          >
            <Magnetic>{lit ? "Turn light off" : "Turn light on"}</Magnetic>
          </button>
          <button type="button" {...stylex.props(foundation.control)} disabled>
            Unavailable
          </button>
          <div {...stylex.props(styles.sample, styles.glow, !lit && lampOff)}>
            <span {...stylex.props(styles.glowSurface)} />
            <span>Local light theme</span>
          </div>
        </div>
        <p {...stylex.props(styles.detail)}>
          Tab to inspect focus rings. Magnetic content moves up to 7 px inside a
          stable control. Interactive objects have cream text on terracotta pill
          labels; phone labels stay visible without frames. The vinyl frame is
          circular. Books combine a group rotation with an independent volume
          shift. Decorative coffee and pencil have no hover frame. Object
          movement: 650 ms. Curtain: 500 ms cover + 650 ms reveal. Reduced
          motion skips spatial hover movement.
        </p>
      </section>
    </div>
  );
}
