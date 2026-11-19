import { NextResponse } from "next/server";
import { getActiveOffers } from "@/app/lib/publicData";
import { PUBLIC_CACHE } from "@/app/lib/memoCache";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// GET /api/public/offers -> { success, data: [coupons usable right now] }
// Only published, in-date coupons, and only the fields a customer needs.
export const dynamic = "force-dynamic";

export async function GET(req) {
  const limit = rateLimit(req, { scope: "public-offers", limit: 60 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  try {
    const data = await getActiveOffers();
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": PUBLIC_CACHE } });
  } catch (error) {
    console.error("Public offers failed:", error.message);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
