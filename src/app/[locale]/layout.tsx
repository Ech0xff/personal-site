import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { cookies } from "next/headers";
import ToastWatcher from "@/components/features/ToastWatcher";
import { ImageViewer } from "@/components/ui/ImageViewer";
import ModalProvider from "@/components/ui/ModalProvider";
import { CACHE_TAGS } from "@/lib/server/cache";
import { CONFIG_KEYS } from "@/lib/shared/config";
import { routing } from "@/lib/shared/i18n/routing";
import { getT } from "@/lib/shared/i18n/tools";
import { fetchConfigs } from "@/lib/shared/services";
import "@/styles/globals.scss";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  "use cache";
  cacheTag(CACHE_TAGS.config);

  const { locale } = await params;
  const t = getT("Meta", locale);
  const configs = await fetchConfigs([CONFIG_KEYS.siteInfo], {
    locale,
  });
  const { title } = configs.get(CONFIG_KEYS.siteInfo)!;

  return {
    title,
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
      <body style={{ anchorName: "--body" }}>
        <ModalProvider>
          <ToastWatcher />
          <SpeedInsights />
          <ImageViewer>{children}</ImageViewer>
        </ModalProvider>
      </body>
    </html>
  );
}
