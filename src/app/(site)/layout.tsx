import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import ThemeScript from "#components/shared/theme-script.component";
import { lightThemeClasses } from "#design/theme.helper";

import { DeskShell } from "./_components/layout/desk-shell.component";

import "lenis/dist/lenis.css";
import "./reset.css";
import "#design/stylex.css";

export const metadata: Metadata = {
  title: {
    default: "The Little Nest",
    template: "The Little Nest - %s",
  },
  description: "A small corner for words, ideas, and everyday wonders.",
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
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
