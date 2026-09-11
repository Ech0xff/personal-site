"use client";

import { useAtomValue } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast, Toaster } from "sonner";

import { useDictionary } from "#dictionary";
import { resolvedThemeAtom } from "#lib/client/theme.atom";
import { readToastFromSearchParams } from "#lib/shared/utils/url-toast.helper";

const BaseToastWatcher = () => {
  const theme = useAtomValue(resolvedThemeAtom);
  const {
    toastCodes: toastMessages,
  }: { toastCodes: Readonly<Record<string, string>> } = useDictionary();
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

  return <Toaster theme={theme} position="top-center" richColors />;
};

export default function ToastWatcher() {
  return (
    <Suspense fallback={null}>
      <BaseToastWatcher />
    </Suspense>
  );
}
