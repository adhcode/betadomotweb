/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild timestamp
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig