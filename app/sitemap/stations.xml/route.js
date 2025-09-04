import { fetchAllPages } from "@/app/lib/sitemapUtils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const allStations = await fetchAllPages(baseUrl, "/api/web-station?limit=50");

  const urls = allStations.map((item) => `
    <url>
      <loc>${baseUrl}/stations/${item.slug}</loc>
      <lastmod>${item.updatedAt || new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
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
