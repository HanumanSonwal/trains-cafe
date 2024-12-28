/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["localhost", "res.cloudinary.com"],
    },
    swcMinify: true,
    output: "standalone",
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;




// next.config.js
// const path = require('path');

// module.exports = {
//   webpack(config, { isServer }) {
//     // Add Less support to Webpack
//     config.module.rules.push({
//       test: /\.less$/,
//       use: [
//         'style-loader',
//         'css-loader',
//         {
//           loader: 'less-loader',
//           options: {
//             lessOptions: {
//               strictMath: true,
//               noIeCompat: true,
//               // Customize your Ant Design theme here
//               modifyVars: { '@primary-color': '#1DA57A' },
//               javascriptEnabled: true,
//             },
//           },
//         },
//       ],
//       include: path.resolve(__dirname, 'node_modules/antd'),
//     });

//     return config;
//   },
// };


