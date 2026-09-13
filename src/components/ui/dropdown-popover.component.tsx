import * as stylex from "@stylexjs/stylex";
import React, { useId } from "react";

import type { StyleInput } from "#design/style.type";
import {
  color,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";

import Stack from "./stack.component";
const styles = stylex.create({
  row: {
    position: "relative",
    alignItems: "center",
  },
  container: {
    pointerEvents: {
      default: "none",
      ":popover-open": "auto",
    },
    position: "fixed",
    zIndex: 10,
    marginTop: space.xs,
    display: {
      default: "none",
      ":popover-open": "flex",
    },
    translate: "-50% 0",
    scale: {
      default: 0.5,
      ":popover-open": 1,
    },
    flexDirection: "column",
    alignItems: "center",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    color: color.secondary,
    opacity: {
      default: 0,
      ":popover-open": 1,
    },
    boxShadow: shadow.subtle,
    transitionDuration: motionToken.fast,
  },
});
interface Props {
  trigger: React.ReactElement<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "button"
  >;
  children: React.ReactNode;
  popoverStyles?: StyleInput;
  xstyle?: StyleInput;
}
export default function DropdownPopover({
  trigger,
  children,
  xstyle,
  popoverStyles,
}: Props) {
  const uniqueId = useId().replace(/:/g, "");
  const popoverId = `popover-${uniqueId}`;
  const anchorName = `--anchor-${uniqueId}`;
  const clonedTrigger = React.cloneElement(trigger, {
    popoverTarget: popoverId,
    style: {
      ...trigger.props.style,
      anchorName,
    },
  });
  return (
    <Stack x xstyle={[styles.row, xstyle]}>
      {clonedTrigger}
      <Stack
        id={popoverId}
        popover="auto"
        xstyle={[styles.container, popoverStyles]}
        style={{
          positionAnchor: anchorName,
          inset: `anchor(bottom) auto auto anchor(center)`,
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
