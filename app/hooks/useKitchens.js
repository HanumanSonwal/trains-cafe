"use client";

import { useEffect, useState } from "react";

/**
 * Which stations have an active Trainscafe kitchen: { "JP": 2, "SMBL": 1 }.
 * One tiny request for the whole network (not one per stop). It is cached in
 * memory for 10 minutes and shared by every component that asks.
 */
const TTL_MS = 10 * 60_000;
let cached = null; // { at, map }
let inflight = null;

function fetchKitchens() {
  if (cached && Date.now() - cached.at < TTL_MS) return Promise.resolve(cached.map);
  if (!inflight) {
    inflight = fetch("/api/journey/kitchens")
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error("kitchens unavailable");
        cached = { at: Date.now(), map: json.kitchens || {} };
        return cached.map;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** `kitchens` is null while loading; `{}` plus `failed` if it could not be loaded. */
export function useKitchens() {
  const [state, setState] = useState({ kitchens: cached?.map ?? null, failed: false });

  useEffect(() => {
    let alive = true;
    fetchKitchens()
      .then((kitchens) => alive && setState({ kitchens, failed: false }))
      .catch(() => alive && setState({ kitchens: {}, failed: true }));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
