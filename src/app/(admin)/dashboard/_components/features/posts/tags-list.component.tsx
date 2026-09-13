import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import { tooltip } from "#design/interaction.stylex";
import type { StyleInput } from "#design/style.type";
import {
  color,
  font,
  space,
  shape,
  shadow,
  layer,
  motionToken,
} from "#design/tokens.stylex";
import type { Tag } from "#types";
const styles = stylex.create({
  row: {
    flexWrap: "nowrap",
    alignItems: "center",
    gap: space.xxs,
  },
  container: {
    flexShrink: 0,
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
    paddingLeft: "6px",
    paddingRight: "6px",
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.small,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    color: color.secondary,
  },
  container2: {
    position: "relative",
    flexShrink: 0,
  },
  container3: {
    cursor: "default",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceStrong,
    paddingLeft: "6px",
    paddingRight: "6px",
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.small,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    color: color.muted,
  },
  container4: {
    pointerEvents: "none",
    visibility: {
      default: "hidden",
      [stylex.when.ancestor(":focus-within", tooltip)]: "visible",
      [stylex.when.ancestor(":hover", tooltip)]: "visible",
    },
    position: "absolute",
    bottom: "100%",
    left: "50%",
    zIndex: layer.tooltip,
    marginBottom: space.xs,
    translate: "-50% 0",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.text,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    fontSize: font.small,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    color: color.inverse,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":focus-within", tooltip)]: 1,
      [stylex.when.ancestor(":hover", tooltip)]: 1,
    },
    boxShadow: shadow.lifted,
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  container5: {
    position: "absolute",
    top: "100%",
    left: "50%",
    translate: "-50% 0",
    borderTopWidth: "4px",
    borderRightWidth: "4px",
    borderBottomWidth: "4px",
    borderLeftWidth: "4px",
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: {
      default: color.viewerCanvas,
      ':is([data-theme="dark"] *)': color.viewerBorder,
    },
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
});
export default function TagsList({
  tags,
  maxVisible = 3,
  xstyle,
}: {
  tags?: Tag[];
  maxVisible?: number;
  xstyle?: StyleInput;
}) {
  if (!tags || tags.length === 0) return null;
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasMore = hiddenTags.length > 0;
  return (
    <Stack x xstyle={[styles.row, xstyle]}>
      {visibleTags.map((tag) => (
        <div key={tag.id} {...stylex.props(styles.container)}>
          {tag.name}
        </div>
      ))}
      {hasMore && (
        <div {...stylex.props([styles.container2, tooltip])}>
          <div {...stylex.props(styles.container3)}>+{hiddenTags.length}</div>
          <div {...stylex.props(styles.container4)}>
            {hiddenTags.map((tag) => tag.name).join(", ")}
            <div {...stylex.props(styles.container5)} />
          </div>
        </div>
      )}
    </Stack>
  );
}
