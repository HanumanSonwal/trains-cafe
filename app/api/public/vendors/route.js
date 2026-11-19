import { NextResponse } from "next/server";
import { getActiveOffers, getStationVendors } from "@/app/lib/publicData";
import { PUBLIC_CACHE } from "@/app/lib/memoCache";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// GET /api/public/vendors?station=AII
//   -> { success, station, data: [kitchens], offers: [live coupons] }
// Read-only and cached (memory + CDN). The admin panel keeps using /api/vendors.
export const dynamic = "force-dynamic";

export async function GET(req) {
  const limit = rateLimit(req, { scope: "public-vendors", limit: 60 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const code = req.nextUrl.searchParams.get("station");
  try {
    const [result, offers] = await Promise.all([getStationVendors(code), getActiveOffers().catch(() => [])]);
    if (!result) {
      return NextResponse.json({ success: false, data: [], message: "Station not found" }, { status: 404 });
    }
    return NextResponse.json(
      { success: true, station: result.station, data: result.vendors, offers },
      { headers: { "Cache-Control": PUBLIC_CACHE } }
    );
  } catch (error) {
    console.error("Public vendors failed:", error.message);
    return NextResponse.json({ success: false, data: [], message: "Could not load kitchens" }, { status: 500 });
  }
}
