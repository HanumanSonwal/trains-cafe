import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

import Settlement from "@/app/models/settlement";

import vendor from "@/app/models/vendor";
import Station from "@/app/models/station";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const vendorId = searchParams.get("vendorid");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isPaidParam = searchParams.get("isPaid");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    if (!vendorId) {
      return Response.json(
        { success: false, message: "vendorid is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return Response.json(
        { success: false, message: "Invalid vendorid" },
        { status: 400 }
      );
    }

    const query = {
      vendor: new mongoose.Types.ObjectId(vendorId),
    };
    if (isPaidParam === "true") query.isPaid = true;
    if (isPaidParam === "false") query.isPaid = false;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      query.startDate = { $lte: end };
      query.endDate = { $gte: start };
    }

    const total = await Settlement.countDocuments(query);

    const settlements = await Settlement.find(query)
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "vendor",
        select: "Vendor_Name trainscafeCommision status",
      })
      .populate({
        path: "station",
        select: "name code",
      })
      .lean();

    return Response.json({
      success: true,
      data: settlements,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Settlement History Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch settlement history",
      },
      { status: 500 }
    );
  }
}
