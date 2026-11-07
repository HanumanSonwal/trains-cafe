// Shared by the search UI and the search API routes so both always agree.
// Keeping these tight is what protects the RailRadar monthly quota.

export const MIN_QUERY_LENGTH = 2; // never search for 0-1 characters
export const SEARCH_LIMIT = 8; // suggestions per search
export const DEBOUNCE_MS = 300; // wait for the user to pause typing

// Lower-case, trim and collapse spaces so "  New  DELHI" and "new delhi"
// share one cache entry (client cache, Next data cache and CDN).
export const normalizeQuery = (q) =>
  String(q ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N} ./&'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
