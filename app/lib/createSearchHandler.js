import { NextResponse } from "next/server";
import { railradar, RailRadarError } from "@/app/lib/railradar";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";
import { MIN_QUERY_LENGTH, SEARCH_LIMIT, normalizeQuery } from "@/app/lib/searchConfig";

// Browsers/CDN keep results for an hour and may serve stale for a day while
// revalidating, so repeat searches rarely reach this server at all.
const CDN_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";
const SHORT_CACHE = "public, s-maxage=60";

/**
 * Builds a GET handler for a RailRadar autocomplete endpoint.
 *
 * @param scope       rate-limit bucket name
 * @param path        RailRadar lookup path, e.g. "/lookup/search/trains"
 * @param revalidate  seconds Next's data cache keeps the upstream response
 * @param map         maps one RailRadar row to what the UI needs
 * @param fallback    optional async (q) => rows used when RailRadar fails
 */
export function createSearchHandler({ scope, path, revalidate, map, fallback }) {
  return async function GET(req) {
    const limit = rateLimit(req, { scope, limit: 40 });
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const q = normalizeQuery(new URL(req.url).searchParams.get("q"));
    if (q.length < MIN_QUERY_LENGTH) {
      return NextResponse.json({ success: true, data: [] }, { headers: { "Cache-Control": CDN_CACHE } });
    }

    try {
      const json = await railradar(path, {
        params: { q, limit: SEARCH_LIMIT },
        revalidate,
      });
      const data = (json.data || []).map(map).filter(Boolean); // map may return null to drop a row
      return NextResponse.json(
        { success: true, data, source: "railradar" },
        { headers: { "Cache-Control": CDN_CACHE } }
      );
    } catch (error) {
      if (fallback) {
        try {
          const data = await fallback(q);
          return NextResponse.json(
            { success: true, data, source: "local" },
            { headers: { "Cache-Control": SHORT_CACHE } }
          );
        } catch (fallbackError) {
          console.error("Search fallback failed:", fallbackError?.message);
        }
      }
      const known = error instanceof RailRadarError;
      if (!known || error.status >= 500) console.error(`Search ${scope} failed:`, error?.message);
      return NextResponse.json(
        { success: false, data: [], message: known ? error.message : "Search failed" },
        { status: known ? error.status : 500 }
      );
    }
  };
}
