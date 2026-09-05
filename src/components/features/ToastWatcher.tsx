"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

import { useT } from "#i18n";
import { useI18n } from "#lib/client/i18n";
import {
  readToastFromSearchParams,
  type ToastType,
} from "#lib/shared/utils/url-toast";

export default function ToastWatcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { dictionary } = useI18n();
  const t = useT();
  const payload = readToastFromSearchParams(searchParams);

  useEffect(() => {
    if (!payload) return;
    const translateCode = (code: string) => {
      if (!(code in dictionary.toastCodes)) return code;
      const key = code as keyof typeof dictionary.toastCodes;
      return t((d) => d.toastCodes[key]);
    };
    const finalMsg =
      payload.message ?? (payload.code ? translateCode(payload.code) : "");
    toast[(payload.type ?? "info") as ToastType](finalMsg);
    router.replace(pathname);
  }, [dictionary.toastCodes, payload, pathname, t, router]);

  return <Toaster position="top-center" richColors />;
}
