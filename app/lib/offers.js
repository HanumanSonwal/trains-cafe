// Coupon helpers shared by the server (public offers API) and the browser
// (vendor cards, checkout). Pure functions only: no database access here.

const rupees = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

const isPercent = (offer) => offer?.discount?.type === "percentage";

/** Discount this offer gives on a subtotal (0 when the minimum is not reached). Never more than the subtotal. */
export function offerSaving(offer, subTotal) {
  const sub = Number(subTotal) || 0;
  if (!offer || sub < (Number(offer.minimumAmount) || 0)) return 0;
  const value = Number(offer.discount?.value) || 0;
  const raw = isPercent(offer) ? (value / 100) * sub : value;
  return Math.max(0, Math.min(sub, Math.round(raw * 100) / 100));
}

/** "Flat ₹75 OFF above ₹149" / "10% OFF above ₹199" */
export function offerLabel(offer) {
  if (!offer) return "";
  const value = Number(offer.discount?.value) || 0;
  const head = isPercent(offer) ? `${value}% OFF` : `Flat ${rupees(value)} OFF`;
  const min = Number(offer.minimumAmount) || 0;
  return min > 0 ? `${head} above ${rupees(min)}` : head;
}

/** The offer worth the most at its own minimum order, for the one-line badge on vendor cards. */
export function bestOffer(offers = []) {
  let best = null;
  let bestValue = -1;
  for (const o of offers) {
    const min = Number(o.minimumAmount) || 0;
    const worth = offerSaving(o, Math.max(min, 1));
    if (worth > bestValue) {
      best = o;
      bestValue = worth;
    }
  }
  return best;
}

export { rupees };
