/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['fal.media'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
    ],
  },
}

module.exports = nextConfig
