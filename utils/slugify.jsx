export const toSlug = (text) =>
    text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
  
  export const createTrainSlug = (name, number) => {
    return `order-food-in-${toSlug(name)}-${number}`;
  };
  
  export const createStationSlug = (name, code) => {
    return `order-food-on-train-at-${toSlug(name)}-${code.toLowerCase()}`;
  };
  