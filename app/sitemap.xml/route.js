// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// export async function GET() {
//   const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

//   const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
//     <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//       <sitemap><loc>${baseUrl}/sitemap/index.xml</loc></sitemap>
//       <sitemap><loc>${baseUrl}/sitemap/stations.xml</loc></sitemap>
//       <sitemap><loc>${baseUrl}/sitemap/trains.xml</loc></sitemap>
//       <sitemap><loc>${baseUrl}/sitemap/blogs.xml</loc></sitemap>
//     </sitemapindex>
//   `;

//   return new NextResponse(sitemapIndex, {
//     headers: {
//       "Content-Type": "application/xml",
//     },
//   });
// }


import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}sitemap/stations.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}sitemap/trains.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}sitemap/blogs.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
