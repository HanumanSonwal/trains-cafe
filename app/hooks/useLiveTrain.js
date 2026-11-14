"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Live status of one train run, kept cheap on the API:
 *  - one request on load, then a refresh every 90s - only while the tab is
 *    visible, only while the train is actually running, and at most 20 times
 *  - coming back to a tab that sat in the background refreshes it once
 *  - the refresh button is throttled (15s) and the server caches each train
 *    for 60s, so many visitors of one train share a single RailRadar call
 *  - an in-flight request is cancelled when a newer one starts or on unmount
 */
const POLL_MS = 90_000;
const MAX_POLLS = 20;
const MIN_GAP_MS = 15_000;

export function useLiveTrain(trainNo, date) {
  const [state, setState] = useState({ data: null, error: "", loading: true, refreshing: false, fetchedAt: 0 });
  const dataRef = useRef(null);
  const lastFetch = useRef(0);
  const polls = useRef(0);
  const controller = useRef(null);

  const load = useCallback(
    async ({ manual = false } = {}) => {
      if (manual && Date.now() - lastFetch.current < MIN_GAP_MS) return;
      controller.current?.abort();
      const ctl = new AbortController();
      controller.current = ctl;
      lastFetch.current = Date.now();

      // Keep showing the old data while refreshing.
      setState((s) => ({ ...s, error: "", loading: !dataRef.current, refreshing: !!dataRef.current }));
      try {
        const qs = new URLSearchParams({ trainNo });
        if (date) qs.set("date", date); // no date = RailRadar picks the run that is on the road now
        const res = await fetch(`/api/rapid/live?${qs}`, { signal: ctl.signal });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.message || "Could not load live status");
        dataRef.current = json.data;
        setState({ data: json.data, error: "", loading: false, refreshing: false, fetchedAt: Date.now() });
      } catch (err) {
        if (err.name === "AbortError") return;
        setState((s) => ({ ...s, loading: false, refreshing: false, error: err.message }));
      }
    },
    [trainNo, date]
  );

  // First load (and reload if the train or date changes).
  useEffect(() => {
    dataRef.current = null;
    polls.current = 0;
    load();
    return () => controller.current?.abort();
  }, [load]);

  // Gentle auto refresh while the train is moving and the tab is in view.
  useEffect(() => {
    const id = setInterval(() => {
      const d = dataRef.current;
      if (document.hidden || !d || !(d.is_live || d.status === "running")) return;
      if (polls.current >= MAX_POLLS) return;
      polls.current += 1;
      load();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  // Returning to a stale tab: refresh once.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && dataRef.current && Date.now() - lastFetch.current > POLL_MS) load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  const refresh = useCallback(() => {
    polls.current = 0; // a manual refresh restarts the auto-refresh budget
    load({ manual: true });
  }, [load]);

  return { ...state, refresh };
}
