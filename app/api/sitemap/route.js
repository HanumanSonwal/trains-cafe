export async function GET() {
  const baseUrl = 'https://trainscafe.in';

  // 👉 Example: Station slugs
  const stations = ['jaipur', 'mumbai', 'delhi']; // Normally DB ya API se aayenge

  const urls = stations
    .map(
      (slug) => `
    <url>
      <loc>${baseUrl}/stations/${slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.0</priority>
    </url>
    ${urls}
  </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
