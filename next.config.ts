import type { NextConfig } from "next";

const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:5000';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:5012';

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
        source: '/api/v1/notifications/:path*',
        destination: `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/:path*`, // Proxy to NotificationService (.NET)
      },
    ];
  },
};

export default nextConfig;
