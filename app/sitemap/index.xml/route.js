import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const staticPages = [
    { slug: "/" },
    { slug: "/blog" },
    { slug: "/cart" },
    { slug: "/checkout" },
    { slug: "/contactus" },
    { slug: "/group-food-ordering-in-train" },
    { slug: "/menu" },
    { slug: "/online-coolie-booking" },
    { slug: "/online-hotel-booking" },
    { slug: "/orderconfirmation" },
    { slug: "/vendor-registration" },
    { slug: "/stations" },
    { slug: "/trains" },
    
  ];

  const urls = staticPages.map((page) => `
    <url>
      <loc>${baseUrl}${page.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
