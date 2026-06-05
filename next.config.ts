import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "q.trap.jp",
        pathname: "/api/v3/public/icon/**",
      },
    ],
  },
};

export default nextConfig;
