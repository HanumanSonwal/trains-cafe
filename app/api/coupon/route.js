import dbConnect from "@/app/lib/dbConnect";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const search = searchParams.get("search") || "";

    await dbConnect();

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
    };

    const coupons = await Coupon.paginate(filter, options);

    if (!coupons || coupons.docs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Coupons not found",
      });
    }

    return NextResponse.json({
      success: true,
      ...coupons,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
