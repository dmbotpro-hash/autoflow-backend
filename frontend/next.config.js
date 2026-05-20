/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Recommended for Cloudflare Pages since standard Image Optimization is not supported on Edge Runtime
  },
};

module.exports = nextConfig;

