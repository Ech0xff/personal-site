import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import ThemeScript from "#components/shared/theme-script.component";
import { lightThemeClasses } from "#design/theme.helper";

import { DeskShell } from "./_components/layout/desk-shell.component";

import "lenis/dist/lenis.css";
import "./reset.css";
import "#design/stylex.css";

export const metadata: Metadata = {
  title: "Ech0xff — The little nest",
  description: "A small corner for words, ideas, and everyday wonders.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27/%3E",
  },
};
export default function SiteLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={lightThemeClasses.join(" ")}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <Suspense fallback={null}>
          <DeskShell>{children}</DeskShell>
        </Suspense>
      </body>
    </html>
  );
}
