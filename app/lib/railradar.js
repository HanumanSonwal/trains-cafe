// Server-only RailRadar client (https://railradar.in/docs).
// Auth: Authorization: Bearer <RAILRADAR_API_KEY>. Every path lives under /v1.
//
// Quota is precious (free plan = 100 req/month), so every call goes through
// Next's shared fetch cache: static-ish lookups are cached for hours, live
// status for a minute. Identical requests never hit RailRadar twice.

const BASE_URL = (process.env.RAILRADAR_BASE_URL || "https://api.railradar.in").replace(/\/+$/, "");

export class RailRadarError extends Error {
  constructor(message, status = 500, code = "RAILRADAR_ERROR") {
    super(message);
    this.name = "RailRadarError";
    this.status = status;
    this.code = code;
  }
}

// Circuit breaker: after a quota (429), server or auth failure, stop calling
// RailRadar for a short while instead of burning more requests on doomed calls.
let cooldownUntil = 0;
const coolDown = (ms) => {
  cooldownUntil = Math.max(cooldownUntil, Date.now() + ms);
};

export async function railradar(path, { params = {}, revalidate = 0, timeout = 8000 } = {}) {
  const apiKey = process.env.RAILRADAR_API_KEY;
  if (!apiKey) {
    throw new RailRadarError("RailRadar API key is not configured", 503, "NO_API_KEY");
  }
  if (Date.now() < cooldownUntil) {
    throw new RailRadarError("RailRadar is temporarily unavailable", 503, "COOLDOWN");
  }

  const url = new URL(`${BASE_URL}/v1${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  let res;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
      signal: AbortSignal.timeout(timeout),
      ...(revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" }),
    });
  } catch (err) {
    coolDown(15_000);
    throw new RailRadarError(
      err?.name === "TimeoutError" ? "RailRadar timed out" : "Could not reach RailRadar",
      504,
      "UPSTREAM_UNREACHABLE"
    );
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON error body */
  }

  if (!res.ok || json?.success === false) {
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after")) || 30;
      coolDown(Math.min(wait, 120) * 1000);
    } else if (res.status === 401) {
      coolDown(60_000);
    } else if (res.status >= 500) {
      coolDown(15_000);
    }
    const code = json?.error?.code || `HTTP_${res.status}`;
    const msg =
      res.status === 429
        ? "Too many requests, please try again shortly"
        : json?.error?.message || `RailRadar request failed (${res.status})`;
    throw new RailRadarError(msg, res.status || 502, code);
  }
  return json;
}

/* ------------------------------ helpers ------------------------------ */

const IST_OFFSET_MS = 330 * 60 * 1000;

// "YYYY-MM-DD" for today in India
export const todayIST = () => new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);

// ISO timestamp (+ optional delay minutes) -> "HH:mm" in IST
const toIstHm = (iso, addMin = 0) => {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t + addMin * 60000 + IST_OFFSET_MS).toISOString().slice(11, 16);
};
const toIstDate = (iso, addMin = 0) => {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  return new Date(t + addMin * 60000 + IST_OFFSET_MS).toISOString().slice(0, 10);
};

// Accepts YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY or anything Date can parse.
export function normalizeDate(input) {
  if (!input) return "";
  const s = String(input).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const t = Date.parse(s);
  return Number.isNaN(t) ? "" : toIstDate(new Date(t).toISOString());
}

const PASSED = new Set(["departed", "skipped", "cancelled", "passed"]);

/**
 * Live status in the shape the existing train page already consumes:
 *   { upcoming_stations: [{ station_name, station_code, eta, ... }], new_message }
 * Only halting stations the train has not yet left are returned.
 */
export async function getLiveTrain(trainNo, date) {
  const json = await railradar(`/trains/${encodeURIComponent(trainNo)}/live`, {
    params: { date: normalizeDate(date) || undefined, haltsOnly: "true" },
    revalidate: 60,
  });
  const d = json.data || {};
  const route = Array.isArray(d.route) ? d.route : [];

  const notStarted = String(d.status || "").toLowerCase() === "not-started";
  const candidates = route
    .filter((s) => s.isHalt !== false && !PASSED.has(String(s.status || "").toLowerCase()))
    .map((s) => {
      const delay = Number(s.delayArrival ?? s.delayDeparture ?? 0) || 0;
      const scheduled = s.scheduledArrival || s.scheduledDeparture || "";
      const expected = s.actualArrival || s.expectedArrival || "";
      const base = expected || scheduled;
      const addMin = expected ? 0 : delay;
      const arrive = Date.parse(s.scheduledArrival);
      const leave = Date.parse(s.scheduledDeparture);
      const halt = arrive && leave && leave > arrive ? Math.round((leave - arrive) / 60000) : 0;
      // A run that has not started yet is "at" its origin only on paper.
      const atStation = String(s.status || "").toLowerCase() === "at-station" && !notStarted;
      const etaMs = Date.parse(base) + addMin * 60000;
      return {
        // RailRadar can lag: a stop still flagged "at-station" well after its halt
        // should have ended is treated as left (see below), not as "train is here".
        _stale: atStation && etaMs + (halt + 15) * 60000 < Date.now(),
        _leaveMs: etaMs + halt * 60000,
        sequence: s.sequence,
        station_name: s.stationName,
        station_code: s.stationCode,
        eta: toIstHm(base, addMin),
        eta_date: toIstDate(base, addMin),
        scheduled_eta: toIstHm(scheduled),
        delay_minutes: delay,
        halt_minutes: halt,
        at_station: atStation,
        platform: s.platform || "",
        distance: s.distance ?? null,
      };
    })
    .filter((s) => s.station_code && s.station_name);

  // Last halt the train has already left: the "Left" side of the status card.
  const lastLeft = [...route]
    .reverse()
    .find((s) => s.isHalt !== false && String(s.status || "").toLowerCase() === "departed");
  const staleStop = candidates.filter((s) => s._stale).pop();
  const left = staleStop
    ? {
        name: staleStop.station_name,
        code: staleStop.station_code,
        time: new Date(staleStop._leaveMs + IST_OFFSET_MS).toISOString().slice(11, 16),
      }
    : lastLeft && {
        name: lastLeft.stationName,
        code: lastLeft.stationCode,
        time: toIstHm(
          lastLeft.actualDeparture || lastLeft.scheduledDeparture,
          lastLeft.actualDeparture ? 0 : Number(lastLeft.delayDeparture) || 0
        ),
      };

  // eslint-disable-next-line no-unused-vars
  const upcoming = candidates.filter((s) => !s._stale).map(({ _stale, _leaveMs, ...stop }) => stop);

  const cancelled =
    String(d.status || "").toLowerCase() === "cancelled" ||
    (d.exceptions || []).some((e) => /cancel/i.test(`${e?.type || ""}`) && !/partial/i.test(`${e?.type || ""}`));

  let message = "";
  if (cancelled) message = "This train is cancelled for the selected date.";
  else if (!upcoming.length) message = "No upcoming halts found for this train on the selected date.";

  return {
    upcoming_stations: upcoming,
    new_message: message,
    train_number: d.trainNumber || d.train?.number || String(trainNo),
    train_name: d.trainName || d.train?.name || "",
    status: cancelled ? "cancelled" : String(d.status || "").toLowerCase(),
    is_live: d.isLive === true,
    delay_minutes: d.delayMinutes ?? 0,
    current_station: d.currentLocation?.stationName || "",
    last_updated: d.lastUpdatedAt || "",
    run_date: d.startDate || normalizeDate(date) || "",
    source: d.train?.source ? { code: d.train.source.code, name: d.train.source.name } : null,
    destination: d.train?.destination
      ? { code: d.train.destination.code, name: d.train.destination.name }
      : null,
    left_station: left || null,
  };
}
