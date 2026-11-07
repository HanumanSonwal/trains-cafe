import pwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
   trailingSlash: false,
  // Lets a second build/server run side by side without clobbering ".next".
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.pexels.com' , 'upload.wikimedia.org',  'cdn-icons-png.flaticon.com' ],
  },
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default pwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
    buildExcludes: [/sw\.js\.map$/], 
})(nextConfig);

