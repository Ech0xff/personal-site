import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

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
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <html lang="en" className={theme}>
      <body>
        {children}
      </body>
    </html>
  );
}
