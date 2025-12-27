
import dbConnect from "@/app/lib/dbConnect";
import Settlement from "@/app/models/settlement";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      vendorId,
      stationId,
      startDate,
      endDate,
      onlineAmount = 0,
      codAmount = 0,
      vendorShare = 0,
      cafeShare = 0,
      tax = 0,
      cafeNet = 0,
      settlementAmount = 0,
      settlementStatus,
      invoiceUrl,
    } = body;

    if (!vendorId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: "vendorId, startDate and endDate required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);

    // Check overlapping settlements
    const exists = await Settlement.findOne({
      vendor: vendorId,
      isPaid: true,
      $or: [
        { startDate: { $lte: end, $gte: start } },
        { endDate: { $gte: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } },
      ],
    });

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Settlement already exists for overlapping date range",
        },
        { status: 400 }
      );
    }

    const settlement = await Settlement.create({
      vendor: vendorId,
      station: stationId || null,
      startDate: start,
      endDate: end,

      onlineAmount,
      codAmount,
      vendorShare,
      cafeShare,
      tax,
      cafeNet,

      settlementAmount,
      settlementStatus,
      invoiceUrl,

      isPaid: true,
      paidAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Settlement marked as paid successfully",
      data: settlement,
    });
  } catch (error) {
    console.error("Settlement Pay Error:", error);
    return NextResponse.json(
      { success: false, message: "Settlement payment failed" },
      { status: 500 }
    );
  }
}
