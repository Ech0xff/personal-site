import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { DeskShell } from "./_components/desk-shell.component";

import "lenis/dist/lenis.css";
import "./reset.css";

export const metadata: Metadata = {
  title: "Ech0xff — The little nest",
  description: "A small corner for words, ideas, and everyday wonders.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27/%3E",
  },
};
export default function RedesignLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <DeskShell>{children}</DeskShell>
        </Suspense>
      </body>
    </html>
  );
}
