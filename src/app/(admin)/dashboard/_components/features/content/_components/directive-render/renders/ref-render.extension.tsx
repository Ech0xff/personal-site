import * as stylex from "@stylexjs/stylex";
import {
  CalendarDays,
  ExternalLink,
  File,
  FileText,
  MessageCircleMore,
} from "lucide-react";

import { color, font, space, shape, motionToken } from "#design/tokens.stylex";

import { refAttributesSchema } from "../directive.schema";
import type { RenderProps } from "../directive.type";
const styles = stylex.create({
  fileText: {
    display: "inline-block",
    height: "14px",
    width: "14px",
    verticalAlign: "-.125em",
  },
  label: {
    marginRight: space.xxs,
    display: "inline-block",
  },
  link: {
    display: "inline",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    verticalAlign: "baseline",
    fontWeight: font.medium,
    whiteSpace: "nowrap",
    textDecorationLine: {
      default: "none",
      ":hover": "underline",
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    color: {
      default: color.infoText,
      ":hover": color.infoText,
    },
    textDecorationColor: `color-mix(in srgb, ${color.infoBorder} 60%, transparent)`,
    textUnderlineOffset: "4px",
    outlineStyle: {
      default: null,
      ":focus-visible": "none",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": "2px",
    },
    outlineColor: {
      default: null,
      ":focus-visible": `color-mix(in srgb, ${color.infoBorder} 40%, transparent)`,
    },
  },
});
type RefType = ReturnType<typeof refAttributesSchema.parse>["type"];
const resolveRefHref = (type: RefType, id: string) => {
  switch (type) {
    case "post":
      return `/posts/${id}`;
    case "thought":
      return `/thoughts#${id}`;
    case "event":
      return `/events#${id}`;
    case "external":
      return id;
    case "file":
      return id;
  }
};
function RefIcon({ type }: { type: RefType }) {
  switch (type) {
    case "post":
      return <FileText {...stylex.props(styles.fileText)} />;
    case "thought":
      return <MessageCircleMore {...stylex.props(styles.fileText)} />;
    case "event":
      return <CalendarDays {...stylex.props(styles.fileText)} />;
    case "external":
      return <ExternalLink {...stylex.props(styles.fileText)} />;
    case "file":
      return <File {...stylex.props(styles.fileText)} />;
  }
}
function render({ attributes, children }: RenderProps) {
  const { id, title, type } = refAttributesSchema.parse(attributes);
  const href = resolveRefHref(type, id);
  return (
    <a
      {...stylex.props([styles.link, null])}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span {...stylex.props(styles.label)}>
        <RefIcon type={type} />
      </span>
      {title ? <span>{title}</span> : children}
    </a>
  );
}
const refDirectiveConfig = {
  directive: "ref",
  directiveType: "textDirective" as const,
  render,
};
export default refDirectiveConfig;
