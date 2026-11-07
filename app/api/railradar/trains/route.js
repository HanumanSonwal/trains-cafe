import { createSearchHandler } from "@/app/lib/createSearchHandler";
import { createTrainSlug } from "@/utils/slugify";

// GET /api/railradar/trains?q=12952  ->  train number / name autocomplete
export const GET = createSearchHandler({
  scope: "search-trains",
  path: "/lookup/search/trains",
  revalidate: 6 * 60 * 60, // the train list barely changes
  map: (t) => ({
    number: t.number,
    name: t.name,
    from: t.source,
    fromName: t.sourceName,
    to: t.dest,
    toName: t.destName,
    slug: createTrainSlug(t.name || "train", t.number),
  }),
});
