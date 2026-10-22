import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(!isProd
    ? {
        async rewrites() {
          return [
            {
              source: '/ForgeWM',
              destination: '/ForgeWM/index.html',
            },
            {
              source: '/ForgeWM/',
              destination: '/ForgeWM/index.html',
            },
          ];
        },
      }
    : {}),
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
