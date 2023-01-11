/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_THE_GRAPH_URL: process.env.NEXT_THE_GRAPH_URL,
    NEXT_ZODIAC_NFT_ADDRESS_GOERLI: process.env.NEXT_ZODIAC_NFT_ADDRESS_GOERLI,
    NEXT_NFT_MARKETPLACE_ADDRESS_GOERLI: process.env.NEXT_NFT_MARKETPLACE_ADDRESS_GOERLI
  },
  images: {
    domains: ["cloudflare-ipfs.com"],
    formats: ["image/avif", "image/webp"],
  },
}

module.exports = nextConfig
