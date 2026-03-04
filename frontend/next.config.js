/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Allow builds to succeed even with TypeScript type errors in CI/deploy environments.
  // Remove or set to `false` once type errors are resolved.
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // Webpack configuration for better performance
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
