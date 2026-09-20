import * as stylex from "@stylexjs/stylex";

import { color, font, space } from "#design/tokens.stylex";
export const styles = stylex.create({
  row: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: space.sm,
  },
  title: {
    fontSize: font.large,
    fontWeight: font.semibold,
    color: color.text,
    overflowWrap: "anywhere",
  },
  editor: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: color.surface,
    color: color.text,
    minHeight: 0,
  },
  header: {
    display: { default: "flex", "@media (max-width: 600px)": "grid" },
    gridTemplateColumns: "1fr auto auto",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    padding: space.md,
    gap: space.sm,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
  },
  scroll: {
    overflowY: "auto",
    flexGrow: 1,
    padding: "4px",
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    width: "100%",
  },
  toolbar: {
    display: { default: "flex", "@media (max-width: 600px)": "contents" },
    alignItems: "center",
    justifyContent: "flex-end",
    gap: space.md,
    flexWrap: "wrap",
  },
  metadata: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    flexWrap: "wrap",
    justifyContent: {
      default: "flex-end",
      "@media (max-width: 600px)": "space-between",
    },
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    gridRowStart: "2",
  },
  save: { gridColumnStart: "2", gridRowStart: "1" },
  close: { gridColumnStart: "3", gridRowStart: "1" },
  error: { color: color.dangerText },
});
