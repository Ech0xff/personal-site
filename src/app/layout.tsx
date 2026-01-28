import type { Metadata } from "next";
import { cookies } from "next/headers";

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

export const metadata: Metadata = {
  title: "BBLF",
  description: "BBLF's reef",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";
  const styles = `group ${theme}`;

  return (
    <html lang="en" className={styles} suppressHydrationWarning>
      <head>
        {/* BLOCKING SCRIPT: Prevents Flash of Unstyled Content (FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isHome = window.location.pathname === '/';
                document.documentElement.dataset.home = isHome;
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
