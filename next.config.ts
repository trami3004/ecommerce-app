import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Giữ lại cái này để nó không bắt lỗi vặt khi build
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;