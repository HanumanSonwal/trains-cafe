// Google Tag Manager data layer helpers (container GTM-PQ7T4DP5 is loaded in app/(website)/layout.js).
// The site only talks to the data layer; what happens next (Google Ads conversion, GA4, ...) is
// configured in Tag Manager, so tags can change without a new deploy.

const TRACKED_KEY = "tc_tracked_orders";
const KEEP_LAST = 50;

export function pushToDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function wasTracked(id) {
  try {
    return (JSON.parse(localStorage.getItem(TRACKED_KEY) || "[]") || []).includes(id);
  } catch {
    return false;
  }
}

function rememberTracked(id) {
  try {
    const list = JSON.parse(localStorage.getItem(TRACKED_KEY) || "[]") || [];
    localStorage.setItem(TRACKED_KEY, JSON.stringify([...list, id].slice(-KEEP_LAST)));
  } catch {
    /* storage blocked: the page-level guard still limits it to one push per page view */
  }
}

/**
 * Tells Tag Manager that an order was really placed (COD placed, or online payment verified).
 * Event "order_placed" with transaction_id, value and currency, plus a GA4-style ecommerce block.
 * An order is pushed once only, even if the confirmation page is reloaded or reopened, because
 * Google Ads counts every push as another conversion. Returns true when it pushed.
 */
export function trackOrderPlaced(order) {
  const id = String(order?.order_id || order?._id || "");
  if (!id || order?.status === "cancel" || wasTracked(id)) return false;

  const value = Math.round((Number(order.total) || 0) * 100) / 100;
  const items = (order.items || []).map((i) => ({
    item_id: String(i._id ?? ""),
    item_name: i.name,
    item_category: i.category || undefined,
    price: Number(i.final_price ?? i.price) || 0,
    quantity: Number(i.quantity) || 1,
  }));

  pushToDataLayer({ ecommerce: null }); // clear any earlier ecommerce data (Tag Manager best practice)
  pushToDataLayer({
    event: "order_placed",
    transaction_id: id,
    value,
    currency: "INR",
    payment_method: order.payment?.method || "",
    ecommerce: { transaction_id: id, value, currency: "INR", items },
  });
  rememberTracked(id);
  return true;
}

/* ------------------------------------------------------------------ */
/* Funnel events (GA4 recommended names, so GA4 and Ads understand them) */
/* ------------------------------------------------------------------ */

export function trackEvent(event, params = {}) {
  pushToDataLayer({ event, ...params });
}

const priceOf = (i) => Number(i?.Final_Price ?? i?.final_price ?? i?.price) || 0;

/** One cart line in GA4 "items" shape. */
export const toItem = (i, quantity = i?.quantity || 1) => ({
  item_id: String(i?._id ?? ""),
  item_name: i?.name,
  item_category: i?.category || i?.foodType || undefined,
  item_brand: i?.vendor || undefined,
  price: priceOf(i),
  quantity,
});

const money = (n) => Math.round((Number(n) || 0) * 100) / 100;
const cartValue = (items) => money(items.reduce((s, i) => s + priceOf(i) * (i.quantity || 1), 0));

function ecommerceEvent(event, items, extra = {}) {
  pushToDataLayer({ ecommerce: null });
  pushToDataLayer({
    event,
    ...extra,
    ecommerce: { currency: "INR", value: cartValue(items), items: items.map((i) => toItem(i)), ...extra.ecommerce },
  });
}

// One unit added to / taken out of the cart (menu page or cart page).
export const trackAddToCart = (item, quantity = 1) =>
  ecommerceEvent("add_to_cart", [{ ...item, quantity }]);
export const trackRemoveFromCart = (item, quantity = 1) =>
  ecommerceEvent("remove_from_cart", [{ ...item, quantity }]);

export const trackViewCart = (items) => items.length && ecommerceEvent("view_cart", items);
export const trackBeginCheckout = (items) => items.length && ecommerceEvent("begin_checkout", items);
export const trackPaymentInfo = (items, method) =>
  items.length && ecommerceEvent("add_payment_info", items, { payment_type: method });

/** Which menu a customer opened. */
export const trackViewMenu = (vendorName, stationName, categoryCount) =>
  trackEvent("view_menu", { vendor_name: vendorName || "", station_name: stationName || "", categories: categoryCount });

/** The customer picked a kitchen (Order Now on a vendor card). */
export const trackSelectVendor = (vendor, station, train) =>
  trackEvent("select_vendor", {
    vendor_name: vendor?.Vendor_Name || vendor?.name || "",
    station_code: station?.station_code || station?.code || "",
    train_number: train?.trainNo || train?.train_number || "",
  });

/**
 * A home-page search. mode: "pnr" | "train" | "station". The term is sent only for train and
 * station searches; a PNR is personal data and never leaves the page.
 */
export const trackSearch = (mode, term = "", extra = {}) =>
  trackEvent("search", { search_mode: mode, search_term: mode === "pnr" ? "" : String(term).slice(0, 60), ...extra });

/** Call / WhatsApp taps. */
export const trackContact = (method, place) => trackEvent("contact_click", { contact_method: method, place });
