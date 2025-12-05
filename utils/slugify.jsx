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

export const parseStationSlug = (slug) => {
  const prefix = "order-food-on-train-at-";

  if (!slug.startsWith(prefix)) {
    return { stationName: "", stationCode: "" };
  }

  const remaining = slug.replace(prefix, "");

  const parts = remaining.split("-");
  const stationCode = parts.pop();

  const stationNameSlug = parts.join("-");

  const stationName = stationNameSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return { stationName, stationCode };
};
