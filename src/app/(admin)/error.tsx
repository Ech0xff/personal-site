"use client";

import * as stylex from "@stylexjs/stylex";
import { AlertTriangle, Home } from "lucide-react";

import Link from "#components/shared/link.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
const styles = stylex.create({
  container: {
    display: "flex",
    height: "100svh",
    width: "100svw",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: space.lg,
    paddingRight: space.lg,
    paddingTop: space.xxl,
    paddingBottom: space.xxl,
  },
  column: {
    width: "100%",
    maxWidth: "448px",
    alignItems: "center",
    gap: "20px",
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
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
    paddingTop: space.xl,
    paddingRight: space.xl,
    paddingBottom: space.xl,
    paddingLeft: space.xl,
    textAlign: "center",
  },
  container2: {
    display: "flex",
    width: "56px",
    height: "56px",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: color.surfaceMuted,
    color: color.secondary,
  },
  alertTriangle: {
    width: "28px",
    height: "28px",
  },
  column2: {
    gap: space.xs,
  },
  heading: {
    fontSize: font.large,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  description: {
    fontSize: font.control,
    lineHeight: "24px",
    overflowWrap: "break-word",
    color: color.secondary,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: {
      default: color.accent,
      ":hover": color.accentHover,
    },
    paddingLeft: space.md,
    paddingRight: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.onAccent,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  home: {
    width: space.md,
    height: space.md,
  },
});
interface Props {
  error: Error & {
    digest?: string;
  };
}
export default function ErrorPage({ error }: Props) {
  const dictionary = useDictionary();
  const message = error.message.trim() || dictionary.errorPage.fallback;
  return (
    <div {...stylex.props(styles.container)}>
      <Stack y xstyle={styles.column}>
        <div {...stylex.props(styles.container2)}>
          <AlertTriangle {...stylex.props(styles.alertTriangle)} />
        </div>
        <Stack y xstyle={styles.column2}>
          <h1 {...stylex.props(styles.heading)}>
            {dictionary.errorPage.title}
          </h1>
          <p {...stylex.props(styles.description)}>{message}</p>
        </Stack>
        <Link {...stylex.props(styles.link)} href="/">
          <Home {...stylex.props(styles.home)} />
          {dictionary.errorPage.backHome}
        </Link>
      </Stack>
    </div>
  );
}
