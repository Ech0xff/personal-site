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
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "system";
  const styles = `group ${theme}`;

  return (
    <html lang="en" className={styles}>
      <body>
        <ScrollHandler />
        {children}
      </body>
    </html>
  );
}
