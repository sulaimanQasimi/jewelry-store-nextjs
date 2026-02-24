import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // API and uploads: CORS so Flutter web can call API and load images from another origin
  async headers() {
    const corsHeaders = [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
      { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, token' },
    ];
    return [
      { source: '/api/:path*', headers: corsHeaders },
      // Allow cross-origin loading of uploaded images (e.g. Flutter web on different port)
      { source: '/uploads/:path*', headers: corsHeaders },
    ];
  },
};

export default nextConfig;
