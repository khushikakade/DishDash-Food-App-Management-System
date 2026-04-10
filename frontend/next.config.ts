import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const configDir = dirname(fileURLToPath(import.meta.url));
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: configDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
    ],
  },
  async rewrites() {
    if (!isDevelopment) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: apiBaseUrl,
  },
};

export default nextConfig;
