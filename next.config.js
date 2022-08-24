/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'i.ibb.co'],
  },
  redirects: async function(){
    return [{
      source: "/admin",
      destination:"/admin/dashboard",
      permanent: true
    }]
  }
}

module.exports = withBundleAnalyzer(nextConfig);
