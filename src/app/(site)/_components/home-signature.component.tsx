"use client";
import * as stylex from "@stylexjs/stylex";

import { Magnetic } from "#components/ui/magnetic.component";
import {
  color,
  font,
  media,
  motionToken,
  shape,
  space,
} from "#design/tokens.stylex";

import { foundation } from "../_design/foundation.style";
import { signature } from "../_design/object-feedback.stylex";
import { profile } from "./desk-content.const";
import { DeskLink } from "./desk-navigation.component";
import { useSignatureSize } from "./use-signature-size.hook";

const styles = stylex.create({
  link: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: shape.touch,
    gap: space.xs,
    fontFamily: font.mono,
    fontSize: {
      default: font.navigation,
      [media.phone]: "clamp(12px, 3.85vw, 15px)",
    },
    color: color.text,
    whiteSpace: "nowrap",
  },
  copyright: {
    display: "inline-block",
    fontSize: "20px",
    transform: {
      default: "rotate(0deg)",
      [stylex.when.ancestor(":hover", signature)]: "rotate(360deg)",
      [stylex.when.ancestor(":focus-visible", signature)]: "rotate(360deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  words: {
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    height: "1.65em",
    transitionProperty: "width",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  wordWidth: (code: string, design: string) => ({
    width: {
      default: code,
      [stylex.when.ancestor(":hover", signature)]: design,
      [stylex.when.ancestor(":focus-visible", signature)]: design,
    },
  }),
  byline: {
    fontFamily: font.mono,
    fontSize: "0.95em",
    fontWeight: font.medium,
  },
  word: {
    position: "absolute",
    top: 0,
    left: 0,
    lineHeight: 1,
    height: "100%",
    width: "max-content",
    display: "flex",
    alignItems: "center",
    transitionProperty: "transform, opacity",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  code: {
    fontFamily: font.mono,
    fontSize: "0.95em",
    fontStyle: "normal",
    fontWeight: font.medium,
    transform: {
      default: "translateY(0)",
      [stylex.when.ancestor(":hover", signature)]: "translateY(100%)",
      [stylex.when.ancestor(":focus-visible", signature)]: "translateY(100%)",
    },
    opacity: {
      default: 1,
      [stylex.when.ancestor(":hover", signature)]: 0,
      [stylex.when.ancestor(":focus-visible", signature)]: 0,
    },
  },
  design: {
    fontFamily: font.artistic,
    fontSize: "1.4em",
    fontStyle: "italic",
    fontWeight: font.medium,
    letterSpacing: "-0.04em",
    transform: {
      default: "translateY(-100%)",
      [stylex.when.ancestor(":hover", signature)]: "translateY(0)",
      [stylex.when.ancestor(":focus-visible", signature)]: "translateY(0)",
    },
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover", signature)]: 1,
      [stylex.when.ancestor(":focus-visible", signature)]: 1,
    },
  },
});
export function HomeSignature({ current }: Readonly<{ current: boolean }>) {
  const size = useSignatureSize();
  const author = profile.name.toLowerCase();
  return (
    <DeskLink
      href="/"
      aria-label={`Home — code and design by ${author}`}
      aria-current={current ? "page" : undefined}
      {...stylex.props(styles.link, signature, foundation.focus)}
    >
      <Magnetic>
        <span aria-hidden="true" {...stylex.props(styles.copyright)}>
          ©
        </span>
        <span
          aria-hidden="true"
          {...stylex.props(
            styles.words,
            styles.wordWidth(size.width.code, size.width.design),
          )}
        >
          <span ref={size.code} {...stylex.props(styles.word, styles.code)}>
            code
          </span>
          <span ref={size.design} {...stylex.props(styles.word, styles.design)}>
            design
          </span>
        </span>
        <span aria-hidden="true" {...stylex.props(styles.byline)}>
          by {author}
        </span>
      </Magnetic>
    </DeskLink>
  );
}
