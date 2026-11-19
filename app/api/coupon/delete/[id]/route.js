import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import mongoose from "mongoose";
import sessionChecker from "@/app/lib/sessionPermission";
import { forget } from "@/app/lib/memoCache";
import { NextResponse } from "next/server";

export async function DELETE(req, context) {
  try {
    if (!(await sessionChecker(req, "coupons", true))) {
      return NextResponse.json({ success: false, message: "Not allowed" }, { status: 401 });
    }
    const { id } = context.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Coupon id is required" });
    }
    await dbConnect();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found" });
    forget("offers");

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
