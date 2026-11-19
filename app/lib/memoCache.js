// Small in-memory cache for public, read-only data (vendors, menus, offers).
//
// - Entries expire after `ttl` ms.
// - Concurrent requests for the same key share one database query.
// - Memory stays bounded (oldest entry is dropped first).
//
// On Vercel each server instance keeps its own copy. Together with the CDN
// headers on the public routes (s-maxage + stale-while-revalidate) most
// visitors never reach MongoDB at all.

const MAX_ENTRIES = 1000;
const store = new Map(); // key -> { value, expires }
const pending = new Map(); // key -> Promise

export function memo(key, ttl, load) {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value);
  if (pending.has(key)) return pending.get(key);

  const job = Promise.resolve()
    .then(load)
    .then((value) => {
      if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
      store.set(key, { value, expires: Date.now() + ttl });
      return value;
    })
    .finally(() => pending.delete(key));
  pending.set(key, job);
  return job;
}

/** Drop cached entries whose key starts with `prefix` (e.g. after an admin edit). */
export function forget(prefix = "") {
  for (const key of store.keys()) if (key.startsWith(prefix)) store.delete(key);
}

/** Cache-Control for public JSON: browsers keep it briefly, the CDN serves it and refreshes in the background. */
export const PUBLIC_CACHE = "public, max-age=30, s-maxage=60, stale-while-revalidate=600";
