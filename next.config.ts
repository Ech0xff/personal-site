import type { NextConfig } from "next";

import { ROUTES } from "#lib/shared/routes/routes.const";

const nextConfig: NextConfig = {
  cacheComponents: true,
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
        source: "/dashboard",
        destination: ROUTES.DASHBOARD.ACCOUNT,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
