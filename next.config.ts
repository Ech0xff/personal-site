import type { NextConfig } from "next";

import { ROUTES } from "#lib/shared/routes/routes.const";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.*.*.*", "[::1]"],
  cacheComponents: true,
  serverExternalPackages: [
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/server-util",
  ],
  reactCompiler: true,
  reactStrictMode: false,
  async redirects() {
    return [
      ...["", "/posts", "/thoughts", "/events", "/system"].map((path) => ({
        source: `/redesign${path}`,
        destination: path || "/",
        permanent: true,
      })),
      {
        source: "/dashboard/images",
        destination: ROUTES.DASHBOARD.FILES,
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: ROUTES.DASHBOARD.POSTS,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
