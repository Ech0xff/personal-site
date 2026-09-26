"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

type NavigationGuard = () => boolean;
type NavigationContext = Readonly<{
  allowNavigation: NavigationGuard;
  registerGuard: (guard: NavigationGuard) => () => void;
}>;
const Context = createContext<NavigationContext | null>(null);

export function DashboardNavigationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const guard = useRef<NavigationGuard | null>(null);
  const allowNavigation = useCallback(() => guard.current?.() ?? true, []);
  const registerGuard = useCallback((next: NavigationGuard) => {
    guard.current = next;
    return () => {
      if (guard.current === next) guard.current = null;
    };
  }, []);
  return (
    <Context value={{ allowNavigation, registerGuard }}>{children}</Context>
  );
}

export function useDashboardNavigation() {
  const value = useContext(Context);
  if (!value) throw new Error("Dashboard navigation requires its provider.");
  return value;
}
