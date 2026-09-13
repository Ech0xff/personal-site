import * as stylex from "@stylexjs/stylex";
import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import type { StyleInput } from "#design/style.type";
import { color, shape } from "#design/tokens.stylex";
interface Props extends ComponentPropsWithoutRef<"div"> {
  x?: boolean;
  y?: boolean;
  divide?: boolean;
  xstyle?: StyleInput;
  childStyles?: StyleInput;
}
type StyledChildProps = {
  xstyle?: StyleInput;
  className?: string;
};
function styleChild(child: ReactNode, xstyle: StyleInput): ReactNode {
  if (!isValidElement<StyledChildProps>(child)) return child;
  if (typeof child.type === "string") {
    return cloneElement(child, {
      className: [stylex.props(xstyle).className, child.props.className]
        .filter(Boolean)
        .join(" "),
    });
  }
  return cloneElement(child, {
    xstyle: [xstyle, child.props.xstyle],
  });
}
export default function Stack({
  x,
  y,
  divide,
  children,
  xstyle,
  childStyles,
  ...props
}: Props) {
  return (
    <div
      {...props}
      {...stylex.props(
        x ? styles.row : y ? styles.column : styles.block,
        xstyle,
      )}
    >
      {divide || childStyles
        ? Children.map(children, (child, index) =>
            styleChild(child, [
              childStyles,
              divide &&
                index > 0 &&
                (x ? styles.verticalDivider : styles.horizontalDivider),
            ]),
          )
        : children}
    </div>
  );
}
const styles = stylex.create({
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  block: {
    display: "block",
  },
  verticalDivider: {
    borderLeftWidth: shape.fine,
    borderLeftStyle: "solid",
    borderLeftColor: color.line,
  },
  horizontalDivider: {
    borderTopWidth: shape.fine,
    borderTopStyle: "solid",
    borderTopColor: color.line,
  },
});
