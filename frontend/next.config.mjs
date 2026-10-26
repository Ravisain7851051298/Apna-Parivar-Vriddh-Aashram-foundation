/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    agentUpgrade: 'security',
    optimizePackageImports: ['react-icons', 'lucide-react', 'react-icons/fi', 'react-icons/fa6', 'react-icons/fa'],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: '**' }
    ]
  },
  async redirects() {
    return [
      {
        source: '/events',
        destination: '/event',
        permanent: true,
      },
      {
        source: '/events/:id',
        destination: '/event/:id',
        permanent: true,
      },
      {
        source: '/profile/apply-member',
        destination: '/apply-member',
        permanent: true,
      },
      {
        source: '/profile/apply-volunteer',
        destination: '/apply-volunteer',
        permanent: true,
      },
      {
        source: '/profile/apply-coordinator',
        destination: '/apply-coordinator',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const rawTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const cleanTarget = rawTarget.trim().replace(/\/api\/?$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${cleanTarget}/api/:path*`
      },
      {
        source: '/uploads/:path*',
        destination: `${cleanTarget}/uploads/:path*`
      }
    ];
  }
};

export default nextConfig;
