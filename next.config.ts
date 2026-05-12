import type { NextConfig } from "next";

import { ROUTES } from "#lib/shared/routes";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: ROUTES.DASHBOARD.ACCOUNT,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
