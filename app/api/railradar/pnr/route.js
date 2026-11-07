import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { railradar, RailRadarError, normalizeDate, todayIST } from "@/app/lib/railradar";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";
import { createTrainSlug } from "@/utils/slugify";

// POST /api/railradar/pnr   body: { "pnr": "1234567890" }
//
// A PNR is personal data, so:
//  - it travels in the POST body (never in a URL, access log or browser history),
//  - the cache is keyed by a hash and only keeps what checkout needs (train,
//    date and the first passenger's coach/seat) - no names or fares.

const FOUND_TTL = 10 * 60_000; // a PNR's status changes a few times a day at most
const MISSING_TTL = 2 * 60_000; // wrong/flushed PNRs: stop re-asking and burning quota
const MAX_ENTRIES = 500;
const cache = new Map(); // sha256(pnr) -> { value, expires }

const sha = (pnr) => createHash("sha256").update(pnr).digest("hex");

function remember(key, value, ttl) {
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value); // oldest first
  cache.set(key, { value, expires: Date.now() + ttl });
}

async function lookup(pnr) {
  const key = sha(pnr);
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;

  try {
    const { data } = await railradar(`/pnr/${pnr}`);
    const train = data?.train;
    if (!train?.number) {
      remember(key, null, MISSING_TTL);
      return null;
    }
    const trainName = train.name || "train";
    const passenger = Array.isArray(data?.passengers) ? data.passengers[0] : null;
    const current = passenger?.current || {};
    const coach = current.coachId || current.coach || passenger?.coach || "";
    const seat =
      current.berthNo ??
      current.berthNumber ??
      passenger?.berthNo ??
      passenger?.berthNumber ??
      "";
    const value = {
      trainNo: String(train.number),
      trainName,
      // The docs put the date in journey.date; live replies carry it on the train.
      // Read both so either shape works.
      date:
        normalizeDate(data?.journey?.date) ||
        normalizeDate(train.journeyDate) ||
        normalizeDate(train.journeyDateRaw) ||
        todayIST(),
      from: train.boardingPoint?.code || train.source?.code || "",
      to: train.reservationUpto?.code || train.destination?.code || "",
      coach: String(coach),
      seatNo: seat === "" ? "" : String(seat),
      passengerCount: Array.isArray(data?.passengers) ? data.passengers.length : 0,
      chartPrepared: data?.charting?.isPrepared === true,
      slug: createTrainSlug(trainName, train.number),
    };
    remember(key, value, FOUND_TTL);
    return value;
  } catch (error) {
    if (error instanceof RailRadarError && error.status === 404) {
      remember(key, null, MISSING_TTL);
      return null;
    }
    throw error;
  }
}

const fail = (message, status) =>
  NextResponse.json({ success: false, message }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req) {
  const limit = rateLimit(req, { scope: "pnr", limit: 10 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const body = await req.json().catch(() => null);
  const pnr = String(body?.pnr ?? "").trim();
  if (!/^\d{10}$/.test(pnr)) return fail("Please enter a valid 10 digit PNR number", 400);

  try {
    const data = await lookup(pnr);
    if (!data) return fail("PNR not found. Please check the number and try again.", 404);
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const known = error instanceof RailRadarError;
    if (!known || error.status >= 500 || error.status === 401) {
      console.error("PNR lookup failed:", error.message); // never log the PNR itself
    }
    const message =
      known && error.status === 429
        ? "Too many requests, please try again shortly"
        : "PNR search is temporarily unavailable. Please order by train name or station.";
    return fail(message, known && error.status === 429 ? 429 : 503);
  }
}
