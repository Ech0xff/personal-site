import * as stylex from "@stylexjs/stylex";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import type { Metadata } from "next";

import ThemeScript from "#components/shared/theme-script.component";
import ToastProvider from "#components/shared/toast-provider.component";
import { ImageViewer } from "#components/ui/image-viewer.component";
import ModalProvider from "#components/ui/modal-provider.component";
import { MODAL_ANCHOR } from "#components/ui/modal.const";
import { adminRoot } from "#design/admin-root.style";
import { lightTheme } from "#design/admin-theme.stylex";
import { DictionaryProvider } from "#lib/client/dictionary/dictionary-provider.component";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";

import "./reset.css";
import "#design/stylex.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const instant = false;

export const generateMetadata = async (): Promise<Metadata> => {
  const dictionary = await getDictionary();
  return {
    title: dictionary.meta.siteTitle,
    description: dictionary.meta.siteDescription,
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
  };
};

const RootLayout = async ({ children }: Readonly<LayoutProps>) => {
  const dictionary = await getDictionary();
  return (
    <html
      suppressHydrationWarning
      lang="en"
      {...stylex.props(lightTheme, adminRoot.document)}
    >
      <head>
        <ThemeScript />
      </head>
      <body style={{ anchorName: MODAL_ANCHOR.BODY }}>
        <DictionaryProvider dictionary={dictionary}>
          <ModalProvider>
            <ToastProvider />
            <SpeedInsights />
            <ImageViewer>{children}</ImageViewer>
          </ModalProvider>
        </DictionaryProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
};

export default RootLayout;
