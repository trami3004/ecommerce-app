import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Thêm dòng này để tăng tốc build
  swcMinify: true,
};

export default nextConfig;