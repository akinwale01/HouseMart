import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    unoptimized: true, // Disable Next.js optimization for remote images (Cloudinary handles it)
  },
};

export default nextConfig;