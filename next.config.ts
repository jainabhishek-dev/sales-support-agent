import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ["@sparticuz/chromium"],
  turbopack: {}, // Silences the webpack config conflict in Next.js 16
  webpack: (config) => {
    config.externals.push({
      "@sparticuz/chromium": "commonjs @sparticuz/chromium",
    });
    return config;
  },
};

export default nextConfig;
