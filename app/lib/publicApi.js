"use client";

// Browser side of the public API. Answers are kept in memory for a few minutes
// and parallel calls share one request, so going back and forth between the
// kitchen list and a menu never waits on the network twice.

const TTL = 3 * 60_000;
const cache = new Map(); // url -> { at, data }
const inflight = new Map(); // url -> Promise

function getJson(url) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.data);
  if (inflight.has(url)) return inflight.get(url);

  const job = fetch(url)
    .then(async (res) => {
      const json = await res.json().catch(() => ({}));
      if (res.status === 404) return { ...json, success: false, notFound: true };
      if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
      cache.set(url, { at: Date.now(), data: json });
      return json;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, job);
  return job;
}

/** Already-loaded data for a url, or null. Lets a page render instantly from cache. */
const peek = (url) => {
  const hit = cache.get(url);
  return hit && Date.now() - hit.at < TTL ? hit.data : null;
};

const vendorsUrl = (code) => `/api/public/vendors?station=${encodeURIComponent(String(code || "").toUpperCase())}`;
const menuUrl = (id) => `/api/public/menu/${encodeURIComponent(id)}`;

export const fetchStationVendors = (code) => getJson(vendorsUrl(code));
export const fetchVendorMenu = (id) => getJson(menuUrl(id));
export const fetchOffers = () => getJson("/api/public/offers");

export const peekVendorMenu = (id) => peek(menuUrl(id));
export const peekStationVendors = (code) => peek(vendorsUrl(code));

/** Warm the menu cache (e.g. when a kitchen card shows up or is touched). Errors are ignored. */
export function prefetchVendorMenu(id) {
  if (!id || peek(menuUrl(id)) || inflight.has(menuUrl(id))) return;
  fetchVendorMenu(id).catch(() => {});
}
