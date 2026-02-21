import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-city-dubai.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Keep support for any potentially public image URLs while debugging if needed
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
