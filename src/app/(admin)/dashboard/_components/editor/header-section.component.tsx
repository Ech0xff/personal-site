import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import { color, font, space, shape } from "#design/tokens.stylex";
const styles = stylex.create({
  row: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    paddingLeft: space.lg,
    paddingRight: space.lg,
    paddingTop: space.md,
    paddingBottom: space.md,
  },
  row2: {
    minWidth: "0px",
    alignItems: "center",
    gap: space.md,
  },
  heading: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.large,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  row3: {
    alignItems: "center",
    gap: space.sm,
  },
});
export default function HeaderSection({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Stack x xstyle={styles.row}>
      <Stack x xstyle={styles.row2}>
        <h1 {...stylex.props(styles.heading)}>{title}</h1>
      </Stack>
      <Stack x xstyle={styles.row3}>
        {children}
      </Stack>
    </Stack>
  );
}
