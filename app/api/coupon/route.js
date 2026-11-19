import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import sessionChecker from "@/app/lib/sessionPermission";
import { NextResponse } from "next/server";

// Admin list. Visitors without a session only see live, published coupons
// (drafts and expired codes are not exposed).
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit"), 10) || 10));
    const search = (searchParams.get("search") || "").trim().slice(0, 50);

    await dbConnect();
    const isStaff = await sessionChecker(req, "coupons", true);

    const filter = {};
    if (search) {
      const rx = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // the search text is data, not a regex
      filter.$or = [
        { title: { $regex: rx, $options: "i" } },
        { code: { $regex: rx, $options: "i" } },
      ];
    }
    if (!isStaff) {
      const now = new Date();
      Object.assign(filter, { status: "published", startDate: { $lte: now }, endDate: { $gte: now } });
    }

    const coupons = await Coupon.paginate(filter, { page, limit, sort: { createdAt: -1 }, lean: true });

    if (!coupons || coupons.docs.length === 0) {
      return NextResponse.json({ success: false, message: "Coupons not found" });
    }
    return NextResponse.json({ success: true, ...coupons });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
