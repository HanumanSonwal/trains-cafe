import { NextResponse } from "next/server";
import { getLiveTrain, normalizeDate, RailRadarError } from "@/app/lib/railradar";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// Kept at /api/rapid/live so the existing train page keeps working,
// but the data now comes from RailRadar.
export async function GET(req) {
  const limit = rateLimit(req, { scope: "live", limit: 60 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const { searchParams } = new URL(req.url);
  const trainNo = (searchParams.get("trainNo") || "").trim();
  const date = normalizeDate(searchParams.get("date"));

  if (!/^[A-Za-z0-9 _/-]{1,20}$/.test(trainNo)) {
    return NextResponse.json(
      { success: false, message: "Missing or invalid train number" },
      { status: 400 }
    );
  }

  try {
    const data = await getLiveTrain(trainNo, date);
    return NextResponse.json(
      { success: true, data, message: "" },
      // Live data is 60s fresh upstream; let the CDN reuse it for the same minute.
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    const known = error instanceof RailRadarError;
    const status = known ? error.status : 500;
    if (!known || status >= 500) console.error("Live train error:", error.message);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: known ? error.message : "Could not fetch live train status",
      },
      { status }
    );
  }
}
