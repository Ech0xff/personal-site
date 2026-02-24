import type { Metadata } from "next";

import { Toaster } from "sonner";

import { routing } from "@/lib/shared/i18n/routing";
import { InitScript } from "@/lib/shared/themeInitScript";
import { LightboxProvider } from "@/providers/LightboxProvider";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

export const metadata: Metadata = {
  title: "BBLF",
  description: "BBLF's reef",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  "use cache";

  const { locale } = await params;
  return (
    <html lang={locale} >
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: InitScript }} />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}
