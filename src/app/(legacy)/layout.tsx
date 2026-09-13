import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import type { Metadata } from "next";

import { useDictionary } from "#dictionary";
import ThemeScript from "#legacy/components/shared/theme-script.component";
import ToastWatcher from "#legacy/components/shared/toast-watcher.component";
import { ImageViewer } from "#legacy/components/ui/image-viewer.component";
import ModalProvider from "#legacy/components/ui/modal-provider.component";
import { MODAL_ANCHOR } from "#legacy/components/ui/modal.const";
import { DictionaryProvider } from "#lib/client/dictionary/dictionary-provider.component";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";

import "#legacy/styles/tailwind.css";
import "#legacy/styles/variables.scss";

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

const RootLayout = ({ children }: Readonly<LayoutProps>) => {
  const dictionary = useDictionary();
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <ThemeScript />
      </head>
      <body style={{ anchorName: MODAL_ANCHOR.BODY }}>
        <DictionaryProvider dictionary={dictionary}>
          <ModalProvider>
            <ToastWatcher />
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
