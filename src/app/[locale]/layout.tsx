import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "sonner";

import { themeInitScript } from "@/lib/shared/themeInitScript";
import AppProvider from "@/providers/AppProvider";
import { LightboxProvider } from "@/providers/LightboxProvider";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

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
        <NextIntlClientProvider locale="en">
          <Toaster position="top-center" richColors />
          
          <AppProvider>
            <LightboxProvider>{children}</LightboxProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
