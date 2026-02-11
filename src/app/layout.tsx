import type { Metadata } from "next";

import { Toaster } from "sonner";

import { themeInitScript } from "@/lib/shared/themeInitScript";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

import AppProvider from "./AppProvider";

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
      <body>
        <Toaster position="top-center" richColors />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
