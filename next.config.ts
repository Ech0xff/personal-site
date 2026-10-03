import type { NextConfig } from "next";

import { ROUTES } from "#lib/shared/routes/routes.const";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.*.*.*", "[::1]"],
  cacheComponents: true,
  outputFileTracingIncludes: {
    "/api/admin/audio/import": ["./node_modules/ffmpeg-static/ffmpeg"],
  },
  serverExternalPackages: [
    "ffmpeg-static",
    "@blocknote/core",
    "@blocknote/react",
    "@blocknote/server-util",
  ],
  reactCompiler: true,
  reactStrictMode: false,
  async rewrites() {
    return [
      "quiet-morning.wav",
      "quiet-morning.spectrum.bin",
      "quiet-morning.vtt",
      "miku.mp3",
      "miku.spectrum.bin",
      "miku.vtt",
    ].map((file) => ({
      source: `/redesign/${file}`,
      destination: `/audio/${file}`,
    }));
  },
  async redirects() {
    return [
      ...["", "/posts", "/thoughts", "/system"].map((path) => ({
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
