// import { NextResponse } from "next/server";

// export async function GET() {
//   const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

//   const staticPages = [
//     { slug: "/" },
//     { slug: "/blog" },
//     { slug: "/cart" },
//     { slug: "/checkout" },
//     { slug: "/contactus" },
//     { slug: "/group-food-ordering-in-train" },
//     { slug: "/menu" },
//     { slug: "/online-coolie-booking" },
//     { slug: "/online-hotel-booking" },
//     { slug: "/orderconfirmation" },
//     { slug: "/vendor-registration" },
//   ];

//   let urls = "";

//   staticPages.forEach((page) => {
//     urls += `
//       <url>
//         <loc>${baseUrl}${page.slug}</loc>
//         <lastmod>${new Date().toISOString()}</lastmod>
//         <changefreq>weekly</changefreq>
//         <priority>0.8</priority>
//       </url>
//     `;
//   });

//   async function fetchAllPages(api) {
//     let page = 1;
//     let allDocs = [];
//     let totalPages = 1;

//     try {
//       while (page <= totalPages) {
//         const res = await fetch(`${baseUrl}${api}&page=${page}`, {
//           cache: "no-store",
//         });
//         const data = await res.json();

//         if (data?.docs?.length) {
//           allDocs = [...allDocs, ...data.docs];
//           totalPages = data.totalPages || 1;
//           page++;
//         } else {
//           break;
//         }
//       }
//     } catch (err) {
//       console.error(`Error fetching ${api}:`, err);
//     }

//     return allDocs;
//   }

//   async function addDynamicUrls(
//     api,
//     prefix,
//     changefreq = "daily",
//     priority = "0.9"
//   ) {
//     const allDocs = await fetchAllPages(api);

//     allDocs.forEach((item) => {
//       if (item.slug) {
//         urls += `
//           <url>
//             <loc>${baseUrl}${prefix}${item.slug}</loc>
//             <lastmod>${item.updatedAt || new Date().toISOString()}</lastmod>
//             <changefreq>${changefreq}</changefreq>
//             <priority>${priority}</priority>
//           </url>
//         `;
//       }
//     });
//   }

//   await addDynamicUrls("/api/web-pages?limit=50", "/");
//   await addDynamicUrls("/api/web-station?limit=50", "/stations/");
//   await addDynamicUrls("/api/web-train?limit=50", "/trains/");
//   await addDynamicUrls("/api/blog?status=publish&limit=50", "/blog/");

//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//       ${urls}
//     </urlset>
//   `;

//   return new NextResponse(sitemap, {
//     headers: {
//       "Content-Type": "application/xml",
//     },
//   });
// }


import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap><loc>${baseUrl}/sitemap/index.xml</loc></sitemap>
      <sitemap><loc>${baseUrl}/sitemap/stations.xml</loc></sitemap>
      <sitemap><loc>${baseUrl}/sitemap/trains.xml</loc></sitemap>
      <sitemap><loc>${baseUrl}/sitemap/blogs.xml</loc></sitemap>
    </sitemapindex>
  `;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
