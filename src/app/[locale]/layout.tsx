import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import LocaleCookieSync from "#components/shared/locale-cookie-sync.component";
import ThemeScript from "#components/shared/theme-script.component";
import ToastWatcher from "#components/shared/toast-watcher.component";
import { ImageViewer } from "#components/ui/image-viewer.component";
import ModalProvider from "#components/ui/modal-provider.component";
import { I18nProvider } from "#lib/client/i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { getI18nConfig, getT } from "#lib/server/i18n";
import { locales } from "#lib/shared/i18n";

import "#styles/tailwind.css";
import "#styles/variables.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

export const instant = false;

export const generateMetadata = async (): Promise<Metadata> => {
  "use cache";
  cacheTag(CACHE_TAGS.config);

  const t = await getT();

  return {
    title: t((d) => d.meta.siteTitle),
    description: t((d) => d.meta.siteDescription),
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
};

const RootLayout = async ({ children }: Readonly<LayoutProps>) => {
  const { locale, dictionary } = await getI18nConfig();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <ThemeScript />
      </head>
      <body style={{ anchorName: "--body" }}>
        <I18nProvider locale={locale} dictionary={dictionary}>
          <LocaleCookieSync />
          <ModalProvider>
            <ToastWatcher />
            <SpeedInsights />
            <ImageViewer>{children}</ImageViewer>
          </ModalProvider>
        </I18nProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
};

export default RootLayout;
