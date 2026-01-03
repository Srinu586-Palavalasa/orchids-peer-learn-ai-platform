import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Removed outputFileTracingRoot that pointed two levels up.
  // This was causing duplicate '/vercel/path0/vercel/path0' paths during Vercel builds.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // turbopack custom loaders removed to avoid executing project-local loaders
  // that require CJS-only dependencies during the build on hosting platforms.
};

export default nextConfig;
// Orchids restart: 1767368133561
