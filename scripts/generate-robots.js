// const { generateRobotsTxt } = require('next-sitemap');

// async function run() {
//   await generateRobotsTxt({
//     siteUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
//     outDir: "./public", // robots.txt iske andar generate hoga
//     robotsTxtOptions: {
//       policies: [
//         {
//           userAgent: "*",
//           allow: "/",
//           disallow: ["/admin", "/dashboard", "/admin-auth", "/api"],
//         },
//         { userAgent: "GPTBot", allow: "/" },
//         { userAgent: "Google-Extended", allow: "/" },
//         { userAgent: "PerplexityBot", allow: "/" },
//         { userAgent: "ClaudeBot", allow: "/" },
//       ],
//       additionalSitemaps: [
//         `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/sitemap.xml`,
//       ],
//     },
//   });
// }

// run();


// scripts/generate-robots.js
const fs = require("fs");
const path = require("path");

const robotsTxt = `
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /admin-auth/
Disallow: /api/

# Allow AI crawlers
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, "../public/robots.txt"), robotsTxt.trim());
console.log("✅ robots.txt generated!");
