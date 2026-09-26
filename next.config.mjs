/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? '/Jabb_Bar' : ''),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
