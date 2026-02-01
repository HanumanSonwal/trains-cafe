// import pwa from 'next-pwa'

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//    trailingSlash: false,
//   images: {
//     domains: ['localhost', 'res.cloudinary.com', 'images.pexels.com' , 'upload.wikimedia.org',  'cdn-icons-png.flaticon.com' ],
//   },
//   swcMinify: true,
//   output: 'standalone',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };
// export default pwa({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//     buildExcludes: [/sw\.js\.map$/], 
// })(nextConfig);

import pwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  images: {
    domains: [
      "localhost",
      "res.cloudinary.com",
      "images.pexels.com",
      "upload.wikimedia.org",
      "cdn-icons-png.flaticon.com",
    ],
  },

  swcMinify: true,
  output: "standalone",

  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)", 
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default pwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/sw\.js\.map$/],
})(nextConfig);
