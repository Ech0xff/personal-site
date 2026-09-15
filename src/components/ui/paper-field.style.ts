import * as stylex from "@stylexjs/stylex";

import { color, font, motionToken, media } from "#design/tokens.stylex";

export const paperFieldStyles = stylex.create({
  field: { minWidth: 0, width: "100%" },
  label: { display: "block", position: "relative", width: "100%" },
  control: {
    display: "block",
    width: "100%",
    minWidth: 0,
    color: color.text,
    fontFamily: font.body,
    fontSize: "16px",
    lineHeight: "32px",
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: {
      default: color.line,
      ":focus": color.accent,
      ':is([aria-invalid="true"])': color.dangerText,
    },
    outlineStyle: "none",
    paddingTop: "28px",
    paddingBottom: "3px",
    paddingInline: "2px",
    transitionProperty: "border-color",
    transitionDuration: motionToken.fast,
  },
  single: { height: "64px" },
  multiline: {
    minHeight: "192px",
    resize: "vertical",
    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 31px, ${color.line} 31px, ${color.line} 32px)`,
    backgroundOrigin: "content-box",
    backgroundClip: "content-box",
  },
  caption: {
    position: "absolute",
    top: "29px",
    left: "2px",
    color: color.muted,
    fontFamily: font.body,
    fontSize: "16px",
    lineHeight: "24px",
    pointerEvents: "none",
    transformOrigin: "left top",
    transform: {
      default: "none",
      ":is(input:focus + *, input:not(:placeholder-shown) + *, textarea:focus + *, textarea:not(:placeholder-shown) + *)":
        "translateY(-23px) scale(0.75)",
    },
    transitionProperty: "transform, color",
    transitionDuration: { default: motionToken.fast, [media.reduce]: "0s" },
  },
  raised: { transform: "translateY(-23px) scale(0.75)" },
  error: {
    color: color.dangerText,
    fontSize: font.small,
    marginTop: "6px",
    marginBottom: 0,
  },
});
