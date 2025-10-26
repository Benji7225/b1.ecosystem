/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui.shadcn.com',
      },
    ],
    unoptimized: true,
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
