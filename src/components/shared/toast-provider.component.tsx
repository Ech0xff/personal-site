"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { Toaster } from "sonner";

import {
  color,
  shape,
  space,
  shadow,
  font,
  layer,
} from "#design/tokens.stylex";
import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";
export default function ToastProvider() {
  const theme = useAtomValue(resolvedThemeAtom);
  return (
    <Toaster
      theme={theme}
      position="top-center"
      style={{
        zIndex: layer.toast,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: stylex.props(styles.toast).className,
          default: stylex.props(styles.normal).className,
          loading: stylex.props(styles.normal).className,
          description: stylex.props(styles.description).className,
          success: stylex.props(styles.success).className,
          warning: stylex.props(styles.warning).className,
          error: stylex.props(styles.error).className,
          info: stylex.props(styles.info).className,
        },
      }}
    />
  );
}
const styles = stylex.create({
  toast: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    borderRadius: shape.card,
    borderWidth: shape.fine,
    borderStyle: "solid",
    boxShadow: shadow.panel,
    fontFamily: font.body,
    fontSize: font.control,
    width: "100%",
  },
  normal: {
    borderColor: color.line,
    backgroundColor: color.surface,
    color: color.text,
  },
  description: {
    color: color.secondary,
  },
  success: {
    backgroundColor: color.successSurface,
    color: color.successText,
    borderColor: color.successBorder,
  },
  warning: {
    backgroundColor: color.warningSurface,
    color: color.warningText,
    borderColor: color.warningBorder,
  },
  error: {
    backgroundColor: color.dangerSurface,
    color: color.dangerText,
    borderColor: color.dangerBorder,
  },
  info: {
    backgroundColor: color.infoSurface,
    color: color.infoText,
    borderColor: color.infoBorder,
  },
});
