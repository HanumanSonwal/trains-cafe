import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import mongoose from "mongoose";
import sessionChecker from "@/app/lib/sessionPermission";
import { parseCouponInput } from "@/app/lib/couponInput";
import { forget } from "@/app/lib/memoCache";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    if (!(await sessionChecker(req, "coupons", true))) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 401 });
    }
    const { id } = context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Coupon id is required" });
    }
    const { data, error } = parseCouponInput(await req.json().catch(() => ({})));
    if (error) return NextResponse.json({ success: false, message: error });

    await dbConnect();
    if (await Coupon.exists({ code: data.code, _id: { $ne: id } })) {
      return NextResponse.json({ success: false, message: "This coupon code already exists" });
    }
    const coupon = await Coupon.findByIdAndUpdate(id, data, { runValidators: true });
    if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found" });
    forget("offers");

    return NextResponse.json({ success: true, message: "Coupon updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
