/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output keeps the Azure App Service container lean.
  output: 'standalone',
};

module.exports = nextConfig;
