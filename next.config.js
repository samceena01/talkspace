/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  maxInactiveAge: 100,
  pagesBufferLength: 0,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main",
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
