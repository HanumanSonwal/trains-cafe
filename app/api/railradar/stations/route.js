import { createSearchHandler } from "@/app/lib/createSearchHandler";
import { SEARCH_LIMIT } from "@/app/lib/searchConfig";
import { createStationSlug } from "@/utils/slugify";
import dbConnect from "@/app/lib/dbConnect";
import StationModel from "@/app/models/station";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toStation = (s) => ({
  code: s.code,
  name: s.name,
  city: s.city || null,
  slug: createStationSlug(s.name, s.code),
});

// Our own stations collection keeps search alive when RailRadar is
// unavailable (no key, quota used up, timeout).
async function searchLocal(q) {
  await dbConnect();
  const rx = new RegExp(escapeRegex(q), "i");
  const rows = await StationModel.find({ $or: [{ name: rx }, { code: rx }] })
    .sort({ name: 1 })
    .limit(SEARCH_LIMIT)
    .select("name code")
    .lean();
  return rows.map(toStation);
}

// GET /api/railradar/stations?q=delhi  ->  station name / code autocomplete
export const GET = createSearchHandler({
  scope: "search-stations",
  path: "/lookup/search/stations",
  revalidate: 24 * 60 * 60,
  map: (s) => (s.isActive === false ? null : toStation(s)), // skip closed stations
  fallback: searchLocal,
});
