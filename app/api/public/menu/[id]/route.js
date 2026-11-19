import { NextResponse } from "next/server";
import { getVendorMenu } from "@/app/lib/publicData";
import { PUBLIC_CACHE } from "@/app/lib/memoCache";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// GET /api/public/menu/:vendorId -> { success, vendor, veg: [categories], nonVeg: [categories] }
// Veg and non-veg come in one response (the old route needed two), cached in memory + CDN.
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const limit = rateLimit(req, { scope: "public-menu", limit: 90 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  try {
    const menu = await getVendorMenu(params.id);
    if (!menu) return NextResponse.json({ success: false, message: "Kitchen not found" }, { status: 404 });
    return NextResponse.json({ success: true, ...menu }, { headers: { "Cache-Control": PUBLIC_CACHE } });
  } catch (error) {
    console.error("Public menu failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not load the menu" }, { status: 500 });
  }
}
