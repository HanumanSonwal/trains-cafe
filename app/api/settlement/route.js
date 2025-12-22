import dbConnect from "@/app/lib/dbConnect";
import mongoose from "mongoose";

import Settlement from "@/app/models/settlement";
import Vendor from "@/app/models/vendor";
import { generateInvoice } from "@/app/lib/generateInvoice";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const vendorId = searchParams.get("vendorid");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const isPaidParam = searchParams.get("isPaid");
    const download = searchParams.get("download");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------
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

    // ------------------------------------------------------
    // BUILD QUERY
    // ------------------------------------------------------
    const query = {
      vendor: new mongoose.Types.ObjectId(vendorId),
    };

    if (isPaidParam === "true") query.isPaid = true;
    if (isPaidParam === "false") query.isPaid = false;

    // Correct date overlapping logic
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      query.startDate = { $lte: end };
      query.endDate = { $gte: start };
    }

    // ------------------------------------------------------
    // FETCH SETTLEMENTS
    // ------------------------------------------------------
    const total = await Settlement.countDocuments(query);

    const settlements = await Settlement.find(query)
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "vendor",
        select: "Vendor_Name trainscafeCommision status",
      })
      .lean();

    // ------------------------------------------------------
    // DOWNLOAD INVOICE
    // ------------------------------------------------------
    if (download === "invoice") {
      if (settlements.length === 0) {
        return Response.json(
          { success: false, message: "No settlement found to generate invoice" },
          { status: 404 }
        );
      }

      // Generate invoice from first matching settlement
      const pdfBuffer = await generateInvoice(settlements[0]);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=invoice-${settlements[0]._id}.pdf`,
        },
      });
    }

    // ------------------------------------------------------
    // NORMAL JSON RESPONSE
    // ------------------------------------------------------
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
