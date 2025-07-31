// /** @type {import('next-sitemap').IConfig} */
// module.exports = {
//   siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // ✅ ENV use karo future-proofing ke liye
//   generateRobotsTxt: true,
//   exclude: ["/admin", "/dashboard"], // ❌ Make sure ye routes app folder me ho
//   robotsTxtOptions: {
//     policies: [{ userAgent: "*", allow: "/" }],
//   },
//   generateIndexSitemap: true, // ✅ Multiple sitemap files ko ek index me dikhata hai
// };


/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "http://localhost:3000", // production mein domain use karna
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*', '/admin-auth/*','/dashboard/*'],
  experimental: {
    appDir: true, // IMPORTANT for Next.js app directory support
  },
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
