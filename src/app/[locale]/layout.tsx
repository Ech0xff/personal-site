import type { Metadata } from "next";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { getT } from "@/lib/shared/i18n/tools";
import { routing } from "@/lib/shared/i18n/routing";
import { InitScript } from "@/lib/shared/themeInitScript";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = getT("Meta", locale);

  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<LayoutProps>) {
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
