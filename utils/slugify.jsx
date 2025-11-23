export const toSlug = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-");

export const createTrainSlug = (name, number) => {
  return `order-food-in-${toSlug(name)}-${number}`;
};

export const createStationSlug = (name, code) => {
  return `order-food-on-train-at-${toSlug(name)}-${code.toLowerCase()}`;
};


// ⭐ NEW FUNCTION (Reverse of createStationSlug)
export const parseStationSlug = (slug) => {
  const prefix = "order-food-on-train-at-";

  if (!slug.startsWith(prefix)) {
    return { stationName: "", stationCode: "" };
  }

  // Remove prefix
  const remaining = slug.replace(prefix, "");  
  // Example: "abutara-halt-abw"

  const parts = remaining.split("-");
  const stationCode = parts.pop(); // last => "abw"

  const stationNameSlug = parts.join("-"); // "abutara-halt"

  // Convert "abutara-halt" → "Abutara Halt"
  const stationName = stationNameSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return { stationName, stationCode };
};
