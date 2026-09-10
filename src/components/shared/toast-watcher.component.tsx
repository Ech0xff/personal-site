"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast, Toaster } from "sonner";

import { useT } from "#i18n";
import { readToastFromSearchParams } from "#lib/shared/utils/url-toast.helper";

const BaseToastWatcher = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useT().scope((d) => d.toastCodes);
  const payload = readToastFromSearchParams(searchParams);
  useEffect(() => {
    if (!payload) return;

    const { message, code, type } = payload;
    const finalMessage =
      message ??
      t((m: Readonly<Record<string, string | undefined>>) =>
        code ? (m[code] ?? code) : "",
      );

    toast[type](finalMessage);
    router.replace(pathname);
  }, [payload, pathname, t, router]);

  return <Toaster position="top-center" richColors />;
};

export default function ToastWatcher() {
  return (
    <Suspense fallback={null}>
      <BaseToastWatcher />
    </Suspense>
  );
}
