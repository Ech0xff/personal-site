"use client";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type Registration = Readonly<{ href: string; round: number; ready: boolean }>;
export const RouteReadinessContext = createContext<
  Readonly<{
    round: number;
    register: (entry: Registration) => () => void;
  }>
>({ round: 0, register: () => () => undefined });

export function useRouteReadiness() {
  const [entries, setEntries] = useState<ReadonlyMap<symbol, Registration>>(
    () => new Map(),
  );
  const register = useCallback((entry: Registration) => {
    const token = Symbol();
    setEntries((previous) => new Map(previous).set(token, entry));
    return () =>
      setEntries((previous) => {
        const next = new Map(previous);
        next.delete(token);
        return next;
      });
  }, []);
  const isReady = (href: string, round: number): boolean => {
    const current = [...entries.values()].filter(
      (entry) => entry.href === href && entry.round === round,
    );
    return current.length > 0 && current.every((entry) => entry.ready);
  };
  return { register, isReady };
}

export function useReportRouteReadiness(ready: boolean, href?: string) {
  const pathname = usePathname();
  const { round, register } = useContext(RouteReadinessContext);
  const route = href ?? pathname;
  useLayoutEffect(
    () => register({ href: route, round, ready }),
    [register, round, route, ready],
  );
}
