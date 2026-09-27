import type { NextConfig } from "next";

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:8080';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:8080';

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
        destination: `${IDENTITY_SERVICE_URL}/api/v1/auth/:path*`,
      },
      {
        source: '/api/v1/admin/:path*',
        destination: `${IDENTITY_SERVICE_URL}/api/v1/admin/:path*`,
      },
      {
        source: '/api/v1/notifications/:path*',
        destination: `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/:path*`,
      },
    ];
  },
};

export default nextConfig;
