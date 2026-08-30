import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";
import { cookies } from "next/headers";
import { Suspense } from "react";

import ToastWatcher from "#components/features/ToastWatcher";
import { ThemeHelper, ThemeProvider } from "#components/providers/theme";
import { ImageViewer } from "#components/ui/ImageViewer";
import ModalProvider from "#components/ui/ModalProvider";
import { I18nProvider } from "#lib/client/i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { getLocale, getT } from "#lib/server/i18n";
import { type Dictionary, locales, type Locale } from "#lib/shared/i18n";

import "#styles/tailwind.css";
import "#styles/variables.scss";
interface LayoutProps {
  children: React.ReactNode;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
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
}

export default async function RootLayout({ children }: Readonly<LayoutProps>) {
  const [locale, translator] = await Promise.all([getLocale(), getT()]);
  const dictionary = translator((value) => value);

  return (
    <Suspense fallback={null}>
      <ConfigShell locale={locale} dictionary={dictionary}>
        {children}
      </ConfigShell>
    </Suspense>
  );
}

async function ConfigShell({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = ThemeHelper.format(cookieStore.get("theme")?.value);

  return (
    <html className={theme} lang={locale}>
      <body style={{ anchorName: "--body" }}>
        <ThemeProvider initialTheme={theme}>
          <ModalProvider>
            <I18nProvider locale={locale} dictionary={dictionary}>
              <ToastWatcher />
              <SpeedInsights />
              <ImageViewer>{children}</ImageViewer>
            </I18nProvider>
            {process.env.NODE_ENV === "development" && <Agentation />}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
