// Tiny in-memory fixed-window rate limiter, keyed by client IP.
//
// Purpose: stop one visitor (or a bot hammering the autocomplete) from burning
// the paid RailRadar / RapidAPI quota. State lives in the server process, so on
// serverless it is per instance - that is still enough to blunt abuse.

const windows = new Map(); // key -> { count, resetAt }
const MAX_KEYS = 5000;

const clientIp = (req) =>
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

export function rateLimit(req, { scope, limit, windowMs = 60_000 }) {
  const now = Date.now();
  const key = `${scope}:${clientIp(req)}`;

  let entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    windows.set(key, entry);
  }
  entry.count += 1;

  // Keep memory bounded.
  if (windows.size > MAX_KEYS) {
    for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
  }

  return {
    ok: entry.count <= limit,
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export const tooManyRequests = (retryAfter) =>
  Response.json(
    { success: false, data: [], message: "Too many requests, please slow down" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
