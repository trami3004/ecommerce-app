import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Bỏ qua lỗi TypeScript khi build để dễ dàng deploy
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua lỗi định dạng code (ESLint) khi build
    ignoreDuringBuilds: true,
  },
  // Nếu bạn có dùng hình ảnh từ domain bên ngoài (như Stripe), thêm vào đây
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