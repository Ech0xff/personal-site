"use client";
import type { ReactNode } from "react";

import { useReportRouteReadiness } from "./route-readiness.hook";

/** Mount only after the route's server data and document rendering have resolved. */
export function RouteReady({
  children,
  href,
}: Readonly<{ children: ReactNode; href?: string }>) {
  useReportRouteReadiness(true, href);
  return children;
}
export function RoutePending() {
  useReportRouteReadiness(false);
  return null;
}
