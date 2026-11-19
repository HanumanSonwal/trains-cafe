// SEO content for the public pages (station pages, train pages, blog posts),
// read straight from MongoDB by the server components.
//
// Before: each page fetched its own /api/... route over HTTP, twice (once for
// the metadata, once for the page) and with `no-store`. On Vercel that is an
// extra function call plus two database queries per visit. Now it is one lean
// query, cached in memory for a few minutes and shared by metadata + page.

import dbConnect from "@/app/lib/dbConnect";
import { memo } from "@/app/lib/memoCache";
import WebStation from "@/app/models/webStation";
import WebTrain from "@/app/models/webtrain";
import StationModel from "@/app/models/station";
import Blog from "@/app/models/blog";

const TTL = 5 * 60_000;

// Plain JSON (ObjectIds and Dates as strings), safe to hand to client components.
const plain = (doc) => (doc ? JSON.parse(JSON.stringify(doc)) : null);

/** Published SEO page for a station (by station code), in the shape /api/web-station/:slug returns. */
export function getWebStation(code) {
  const slug = String(code || "").trim().toLowerCase();
  if (!/^[a-z0-9]{1,8}$/.test(slug)) return Promise.resolve(null);
  return memo(`web-station:${slug}`, TTL, async () => {
    await dbConnect();
    const page = await WebStation.findOne({ slug, status: "published" }).lean();
    if (!page) return null;
    const station = page.Station ? await StationModel.findById(page.Station).lean() : null;
    return plain({ ...page, StationDetails: station || null });
  });
}

/** Published SEO content for a train (by train number). */
export function getWebTrain(trainNo) {
  const number = String(trainNo || "").trim();
  if (!/^\d{4,5}$/.test(number)) return Promise.resolve(null);
  return memo(`web-train:${number}`, TTL, async () => {
    await dbConnect();
    return plain(
      await WebTrain.findOne({ trainnumber: number, status: "published" })
        .select("title description keywords pageData trainnumber")
        .lean()
    );
  });
}

/** One blog post by slug (same rule as /api/blog?slug=). */
export function getBlog(slug) {
  const key = String(slug || "").trim().toLowerCase();
  if (!/^[a-z0-9-]{1,200}$/.test(key)) return Promise.resolve(null);
  return memo(`blog:${key}`, TTL, async () => {
    await dbConnect();
    return plain(await Blog.findOne({ slug: key }).lean());
  });
}

/** Published posts in the same category, without their (heavy) body. */
export function getRelatedBlogs(category, excludeSlug, limit = 6) {
  if (!category) return Promise.resolve([]);
  return memo(`blog-related:${category}:${excludeSlug}`, TTL, async () => {
    await dbConnect();
    return plain(
      await Blog.find({ category, status: "publish", slug: { $ne: excludeSlug } })
        .select("title slug image category description updatedAt createdAt")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean()
    );
  });
}
