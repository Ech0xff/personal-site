import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { cookies } from "next/headers";

import { ImageViewer } from "@/components/ui/ImageViewer";
import { routing } from "@/lib/shared/i18n/routing";
import { getT } from "@/lib/shared/i18n/tools";
import "@/styles/globals.scss";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";
import { Suspense } from "react";
import ToastWatcher from "@/features/toast-watcher";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
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
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<LayoutProps>) {
  const { locale } = await params;

  return (
    <Suspense fallback={null}>
      <ConfigShell locale={locale}>{children}</ConfigShell>
    </Suspense>
  );
}

async function ConfigShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";
  return (
    <html className={theme} lang={locale}>
      <body>
        <ToastWatcher />
        <SpeedInsights />
        <ImageViewer>{children}</ImageViewer>
      </body>
    </html>
  );
}
