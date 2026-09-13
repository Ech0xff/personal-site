"use client";

import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast, Toaster } from "sonner";

import {
  color,
  shape,
  space,
  shadow,
  font,
  layer,
} from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";
import { readToastFromSearchParams } from "#lib/shared/utils/url-toast.helper";
const BaseToastWatcher = () => {
  const theme = useAtomValue(resolvedThemeAtom);
  const {
    toastCodes: toastMessages,
  }: {
    toastCodes: Readonly<Record<string, string>>;
  } = useDictionary();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const payload = readToastFromSearchParams(searchParams);
  useEffect(() => {
    if (!payload) return;
    const { message, code, type } = payload;
    const finalMessage = message ?? (code ? (toastMessages[code] ?? code) : "");
    toast[type](finalMessage);
    router.replace(pathname);
  }, [payload, pathname, router, toastMessages]);
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
};
export default function ToastWatcher() {
  return (
    <Suspense fallback={null}>
      <BaseToastWatcher />
    </Suspense>
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
