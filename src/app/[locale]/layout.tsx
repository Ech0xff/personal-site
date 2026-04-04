import type { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { routing } from "@/lib/shared/i18n/routing";
import { InitScript } from "@/lib/shared/themeInitScript";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

export const metadata: Metadata = {
  title: "Blog",
  description: "Muyu‘s Nest",
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
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: InitScript }} />
      </head>
      <body>
        <Toaster position="top-center" richColors />
        <SpeedInsights />
        <ImageViewer>{children}</ImageViewer>
      </body>
    </html>
  );
}
