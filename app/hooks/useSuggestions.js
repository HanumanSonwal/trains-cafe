"use client";

import { useEffect, useState } from "react";
import {
  DEBOUNCE_MS,
  MIN_QUERY_LENGTH,
  SEARCH_LIMIT,
  normalizeQuery,
} from "@/app/lib/searchConfig";

/**
 * Autocomplete data layer for the home search. Every API call it avoids is
 * RailRadar quota saved. In order, a search is answered by:
 *   1. the cache (exact query),
 *   2. a cached shorter query whose result set was complete (filtered locally),
 *   3. an already running identical request (de-duplicated),
 *   4. one network request - only after the user paused typing.
 */

const ENDPOINT = { train: "/api/railradar/trains", station: "/api/railradar/stations" };

// Fields a typed query is matched against when narrowing a cached result.
const SEARCHABLE = {
  train: (o) => [o.name, o.number, o.from, o.fromName, o.to, o.toName],
  station: (o) => [o.name, o.code, o.city],
};

const MAX_CACHE_ENTRIES = 200;
const cache = new Map(); // "kind:query" -> { items, complete }
const inflight = new Map(); // "kind:query" -> Promise<items>

function remember(key, items) {
  if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value); // oldest first
  // Fewer rows than the limit means the server returned *every* match.
  cache.set(key, { items, complete: items.length < SEARCH_LIMIT });
}

function fromCache(kind, query) {
  const exact = cache.get(`${kind}:${query}`);
  if (exact) return exact.items;

  // "shatab" can be answered from a complete "sha" result without a request.
  for (let len = query.length - 1; len >= MIN_QUERY_LENGTH; len--) {
    const prefix = cache.get(`${kind}:${query.slice(0, len)}`);
    if (!prefix?.complete) continue;
    const words = query.split(" ");
    return prefix.items.filter((item) => {
      const text = SEARCHABLE[kind](item).filter(Boolean).join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }
  return null;
}

/** Promise-based lookup, shared by the typing hook and the Submit button. */
export function loadSuggestions(kind, rawQuery) {
  const query = normalizeQuery(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return Promise.resolve([]);

  const cached = fromCache(kind, query);
  if (cached) return Promise.resolve(cached);

  const key = `${kind}:${query}`;
  if (!inflight.has(key)) {
    const request = fetch(`${ENDPOINT[kind]}?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error(json.message || "Search failed");
        const items = json.data || [];
        remember(key, items);
        return items;
      })
      .finally(() => inflight.delete(key));
    inflight.set(key, request);
  }
  return inflight.get(key);
}

const IDLE = { options: [], loading: false, error: "" };

/**
 * @param kind     "train" | "station"
 * @param value    what the user has typed
 * @param enabled  false while a suggestion is already picked (no searching)
 */
export function useSuggestions(kind, value, enabled = true) {
  const [state, setState] = useState(IDLE);
  // Depend on the normalized query: extra spaces / case changes never re-search.
  const query = normalizeQuery(value);

  useEffect(() => {
    if (!enabled || query.length < MIN_QUERY_LENGTH) {
      setState((s) => (s === IDLE ? s : IDLE));
      return;
    }

    const cached = fromCache(kind, query);
    if (cached) {
      setState({ options: cached, loading: false, error: "" }); // instant, no debounce
      return;
    }

    let stale = false;
    setState((s) => ({ ...s, loading: true, error: "" })); // keep old rows visible meanwhile
    const timer = setTimeout(() => {
      loadSuggestions(kind, query)
        .then((options) => !stale && setState({ options, loading: false, error: "" }))
        .catch((err) => !stale && setState({ options: [], loading: false, error: err.message }));
    }, DEBOUNCE_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [kind, query, enabled]);

  return state;
}
