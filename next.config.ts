import type { NextConfig } from "next";

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:5000';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/auth/:path*',
        destination: `${IDENTITY_SERVICE_URL}/api/v1/auth/:path*`, // Proxy to IdentityService (.NET)
      },
      {
        source: '/api/v1/admin/:path*',
        destination: `${IDENTITY_SERVICE_URL}/api/v1/admin/:path*`, // Proxy to Admin Backend Service
      },
    ];
  },
};

export default nextConfig;
