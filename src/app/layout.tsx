import type { Metadata } from "next";

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

import { themeInitScript } from "@/lib/themeInitScript";

export const metadata: Metadata = {
  title: "BBLF",
  description: "BBLF's reef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
