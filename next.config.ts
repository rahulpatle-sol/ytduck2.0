import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


    eslint: {
    ignoreDuringBuilds: true, // ✅ disables eslint check in render build
  },
};


export default nextConfig;
