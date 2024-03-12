import { env } from './src/env.mjs'

// console.log('--------------------------------')
// console.log('\n\n')
// console.log(env.NEXT_OUTPUT, 'NEXT_OUTPUT')
// console.log('\n\n')
// console.log('--------------------------------')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.NEXT_OUTPUT || 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: '*',
      },
    ],
  },
}

export default nextConfig
