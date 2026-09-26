/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? (isStaticExport ? '/Jabb_Bar' : ''),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
