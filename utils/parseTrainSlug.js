const PREFIX = "order-food-in-";

// "order-food-in-tejas-rajdhani-express-12952" -> { trainNo: "12952", trainName: "Tejas Rajdhani Express" }
export function parseTrainSlug(slug) {
  if (!slug) return { trainNo: "", trainName: "" };

  const clean = slug.startsWith(PREFIX) ? slug.slice(PREFIX.length) : slug;
  const parts = clean.split("-");
  const trainNo = parts[parts.length - 1];
  const trainName = parts
    .slice(0, -1)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");

  return { trainNo, trainName };
}
