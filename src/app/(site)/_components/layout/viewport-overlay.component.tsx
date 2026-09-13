"use client";
import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const ViewportOverlayContext = createContext<HTMLDivElement | null>(
  null,
);

/** Keep fixed UI outside the transformed page, while retaining shell inertness. */
export function ViewportOverlay({
  children,
}: Readonly<{ children: ReactNode }>) {
  const container = useContext(ViewportOverlayContext);
  return container ? createPortal(children, container) : null;
}
