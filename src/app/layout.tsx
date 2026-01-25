import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import ScrollHandler from "@/components/ScrollHandler";

export const metadata: Metadata = {
  title: "BBLF",
  description: "BBLF's reef",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";

  return (
    <html lang="en" className={`${theme} group`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = document.cookie.match(/theme=([^;]+)/)?.[1] || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ScrollHandler />
        {children}
      </body>
    </html>
  );
}
