/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_THE_GRAPH_URL: process.env.NEXT_THE_GRAPH_URL
  },
  images: {
    domains: ["cloudflare-ipfs.com"],
    formats: ["image/avif", "image/webp"],
},
}

module.exports = nextConfig
