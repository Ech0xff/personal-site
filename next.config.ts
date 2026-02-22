import type { NextConfig } from "next";

import path from "path";

import { ROUTES } from "@/lib/shared/routes";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  cacheComponents: true,
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
