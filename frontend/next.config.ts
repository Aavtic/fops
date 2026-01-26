import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig;

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}


export default nextConfig;
