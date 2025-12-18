import dbConnect from "@/app/lib/dbConnect";
import Settlement from "@/app/models/settlement";

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
      return Response.json(
        { success: false, message: "vendorId, startDate and endDate required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const exists = await Settlement.findOne({
      vendor: vendorId,
      isPaid: true,
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (exists) {
      return Response.json(
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

    return Response.json({
      success: true,
      message: "Settlement marked as paid successfully",
      data: settlement,
    });
  } catch (error) {
    console.error("Settlement Pay Error:", error);
    return Response.json(
      { success: false, message: "Settlement payment failed" },
      { status: 500 }
    );
  }
}
