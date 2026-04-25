import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ["@sparticuz/chromium"],
  webpack: (config) => {
    config.externals.push({
      "@sparticuz/chromium": "@sparticuz/chromium",
    });
    return config;
  },
};

export default nextConfig;
