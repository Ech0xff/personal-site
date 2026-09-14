"use client";
// Next.js 16.3 requires its PrefetchKind enum when providing onInvalidate.
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { navigation } from "./navigation.const";

export function useRoutePrefetch() {
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    const prefetch = (href: string) => {
      if (cancelled) return;
      router.prefetch(href, {
        kind: PrefetchKind.FULL,
        onInvalidate: () => prefetch(href),
      });
    };
    navigation
      .filter(({ href }) => href !== "/")
      .forEach(({ href }) => prefetch(href));
    return () => {
      cancelled = true;
    };
  }, [router]);
}
