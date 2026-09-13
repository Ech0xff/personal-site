import * as stylex from "@stylexjs/stylex";

import { color, font, space, shape, shadow } from "#design/tokens.stylex";

import { cardAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../directive.type";
const styles = stylex.create({
  state: {
    borderTopColor: color.successBorder,
    borderRightColor: color.successBorder,
    borderBottomColor: color.successBorder,
    borderLeftColor: color.successBorder,
    backgroundColor: `color-mix(in srgb, ${color.successSurface} 80%, transparent)`,
    color: color.successText,
  },
  state2: {
    borderTopColor: color.warningBorder,
    borderRightColor: color.warningBorder,
    borderBottomColor: color.warningBorder,
    borderLeftColor: color.warningBorder,
    backgroundColor: `color-mix(in srgb, ${color.warningSurface} 80%, transparent)`,
    color: color.warningText,
  },
  state3: {
    borderTopColor: color.dangerBorder,
    borderRightColor: color.dangerBorder,
    borderBottomColor: color.dangerBorder,
    borderLeftColor: color.dangerBorder,
    backgroundColor: `color-mix(in srgb, ${color.dangerSurface} 80%, transparent)`,
    color: color.dangerText,
  },
  state4: {
    borderTopColor: color.infoBorder,
    borderRightColor: color.infoBorder,
    borderBottomColor: color.infoBorder,
    borderLeftColor: color.infoBorder,
    backgroundColor: `color-mix(in srgb, ${color.infoSurface} 80%, transparent)`,
    color: color.infoText,
  },
  state5: {
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: `color-mix(in srgb, ${color.surfaceMuted} 80%, transparent)`,
    color: color.text,
  },
  section: {
    marginTop: space.md,
    marginBottom: space.md,
    borderTopLeftRadius: shape.panel,
    borderTopRightRadius: shape.panel,
    borderBottomRightRadius: shape.panel,
    borderBottomLeftRadius: shape.panel,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    boxShadow: shadow.subtle,
  },
  heading: {
    fontWeight: font.semibold,
  },
});
function toneStyles(
  tone: ReturnType<typeof cardAttributesSchema.parse>["tone"],
) {
  switch (tone) {
    case "tip":
    case "success":
      return styles.state;
    case "warn":
      return styles.state2;
    case "danger":
      return styles.state3;
    case "info":
      return styles.state4;
    case undefined:
      return styles.state5;
  }
}
function render({ attributes, children }: RenderProps) {
  const cardAttributes = cardAttributesSchema.parse(attributes);
  return (
    <section
      {...stylex.props([styles.section, toneStyles(cardAttributes.tone)])}
    >
      <h1 {...stylex.props(styles.heading)}>{cardAttributes.title}</h1>
      {children}
    </section>
  );
}
const cardDirectiveConfig = {
  directive: "card",
  directiveType: "containerDirective" as const,
  render,
};
export default cardDirectiveConfig;
