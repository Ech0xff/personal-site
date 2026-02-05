import type { Metadata } from "next";

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/variables.scss";

export const metadata: Metadata = {
  title: "BBLF",
  description: "BBLF's reef",
};

// Blocking script to prevent FOUC - reads cookie and sets theme before paint
const themeInitScript = `
(function() {
  var cookies = document.cookie.split('; ');
  var theme = 'system';
  for (var i = 0; i < cookies.length; i++) {
    var parts = cookies[i].split('=');
    if (parts[0] === 'theme') {
      theme = parts[1];
      break;
    }
  }
  document.documentElement.classList.add('group', theme);
  document.documentElement.dataset.home = window.location.pathname === '/';
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
