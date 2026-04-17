"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

import { useCurrentLocale } from "@/lib/client/locale";
import { getT } from "@/lib/shared/i18n";
import {
  readToastFromSearchParams,
  type ToastType,
} from "@/lib/shared/utils/url-toast";

export default function ToastWatcher() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useCurrentLocale();
  const t = getT("ToastCodes", locale);
  const payload = readToastFromSearchParams(searchParams);

  useEffect(() => {
    if (!payload) return;
    const finalMsg = payload.message ?? (payload.code ? t(payload.code) : "");
    toast[(payload.type ?? "info") as ToastType](finalMsg);
    router.replace(pathname);
  }, [payload, pathname, t, router]);

  return <Toaster position="top-center" richColors />;
}
