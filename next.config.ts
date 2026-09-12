import type { NextConfig } from "next";

import { ROUTES } from "#lib/shared/routes/routes.const";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/en-US",
        destination: "/",
        permanent: true,
      },
      {
        source: "/zh-CN",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en-US/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/zh-CN/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: ROUTES.DASHBOARD.ACCOUNT,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
