import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import VendorModel from "@/app/models/vendor";
import StationModel from "@/app/models/station";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// GET /api/journey/kitchens  ->  { success, kitchens: { "JP": 2, "SMBL": 1, ... } }
//
// READ-ONLY. One small aggregate over the existing vendors/stations
// collections: how many *active* kitchens each station has. The journey page
// uses it to mark the stops on a train's route that can deliver food, so it
// never has to ask the database station by station (a 25-stop train would
// otherwise mean 25 vendor lookups). Nothing is written or changed.
export const dynamic = "force-dynamic";

const TTL_MS = 10 * 60_000;
let cache = { at: 0, value: null, pending: null };

async function loadKitchens() {
  await dbConnect();

  const grouped = await VendorModel.aggregate([
    { $match: { Status: "Active" } },
    { $group: { _id: "$Station", count: { $sum: 1 } } },
  ]);
  const stations = await StationModel.find(
    { _id: { $in: grouped.map((g) => g._id) }, status: { $ne: false } },
    "code"
  ).lean();
  const codeById = new Map(stations.map((s) => [String(s._id), s.code]));

  const kitchens = {};
  for (const { _id, count } of grouped) {
    const code = codeById.get(String(_id))?.trim().toUpperCase();
    if (code) kitchens[code] = (kitchens[code] || 0) + count;
  }
  return kitchens;
}

// Cached in memory and de-duplicated: a burst of visitors runs one query.
function getKitchens() {
  if (cache.value && Date.now() - cache.at < TTL_MS) return Promise.resolve(cache.value);
  if (!cache.pending) {
    cache.pending = loadKitchens()
      .then((value) => {
        cache = { at: Date.now(), value, pending: null };
        return value;
      })
      .catch((error) => {
        cache.pending = null;
        throw error;
      });
  }
  return cache.pending;
}

export async function GET(req) {
  const limit = rateLimit(req, { scope: "kitchens", limit: 30 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  try {
    const kitchens = await getKitchens();
    return NextResponse.json(
      { success: true, kitchens },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } }
    );
  } catch (error) {
    console.error("Kitchens lookup failed:", error.message);
    // The page still works without badges, so fail soft.
    return NextResponse.json({ success: false, kitchens: {} }, { status: 503 });
  }
}
