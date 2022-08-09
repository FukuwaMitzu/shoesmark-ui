/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost','assets.adidas.com'],
  },
  redirects: async function(){
    return [{
      source: "/admin",
      destination:"/admin/dashboard",
      permanent: true
    }]
  }
}

module.exports = nextConfig
