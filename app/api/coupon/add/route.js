import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import sessionChecker from "@/app/lib/sessionPermission";
import { parseCouponInput } from "@/app/lib/couponInput";
import { forget } from "@/app/lib/memoCache";
import { NextResponse } from "next/server";

// Admin only: before this check, anyone could create a 100% coupon.
export async function POST(req) {
  try {
    if (!(await sessionChecker(req, "coupons", true))) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 401 });
    }
    const { data, error } = parseCouponInput(await req.json().catch(() => ({})));
    if (error) return NextResponse.json({ success: false, message: error });

    await dbConnect();
    if (await Coupon.exists({ code: data.code })) {
      return NextResponse.json({ success: false, message: "This coupon code already exists" });
    }
    await new Coupon(data).save();
    forget("offers"); // the public offers list refreshes right away

    return NextResponse.json({ success: true, message: "Coupon added successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
