// ✅ Helper to parse train slug to trainName & trainNo

export function parseTrainSlug(slug) {
  if (!slug) return { trainNo: "", trainName: "" };

  const parts = slug.split("-");
  const trainNo = parts[parts.length - 1];
  const trainName = parts.slice(0, -1).join(" ");

  return { trainNo, trainName };
}
