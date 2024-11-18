/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    GOOGLE_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
  },
}

module.exports = nextConfig 