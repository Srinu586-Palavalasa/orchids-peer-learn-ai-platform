import type { NextConfig } from "next";
import path from "node:path";

export const dynamic = 'force-dynamic'
export const revalidate = 60 // seconds

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
  // turbopack custom loaders removed to avoid executing project-local loaders
  // that require CJS-only dependencies during the build on hosting platforms.
};

export default nextConfig;
// Orchids restart: 1767368133561
