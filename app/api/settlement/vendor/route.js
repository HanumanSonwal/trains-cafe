import dbConnect from "@/app/lib/dbConnect";
import OrderModel from "@/app/models/order";
import VendorModel from "@/app/models/vendor";
import Settlement from "@/app/models/settlement";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorid");
    let startDate = searchParams.get("startDate");
    let endDate = searchParams.get("endDate");

    if (!vendorId) {
      return Response.json(
        { success: false, message: "Vendor ID required" },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const overlapSettlement = await Settlement.findOne({
      vendor: vendorId,
      isPaid: true,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    }).select("startDate endDate");

    const orders = await OrderModel.find({
      vendor: vendorId,
      createdAt: { $gte: startDate, $lte: endDate },
    });

    let onlineAmount = 0;
    let codAmount = 0;
    let subTotal = 0;
    let discount = 0;

    const daily = {};

    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split("T")[0];

      if (!daily[dateKey]) {
        daily[dateKey] = { online: 0, cod: 0, total: 0 };
      }

      const total = Number(order.total || order.subTotal || 0);
      const method = order.payment?.payment_method;
      const advance = Number(order.payment?.advanced || 0);

      subTotal += Number(order.subTotal || 0);
      discount += Number(order.totalDiscount || 0);

      if (method === "COD") {
        if (advance > 0) {
          onlineAmount += advance;
          codAmount += total - advance;
          daily[dateKey].online += advance;
          daily[dateKey].cod += total - advance;
        } else {
          codAmount += total;
          daily[dateKey].cod += total;
        }
      } else {
        onlineAmount += total;
        daily[dateKey].online += total;
      }

      daily[dateKey].total += total;
    }

    const vendor = await VendorModel.findById(vendorId);
    const cafePercent = Number(vendor.trainscafeCommision || 0);
    const vendorPercent = 100 - cafePercent;

    const vendorShare = Number(((subTotal * vendorPercent) / 100).toFixed(2));
    const cafeShare = Number(
      (((subTotal * cafePercent) / 100) - discount).toFixed(2)
    );
    const tax = Number((subTotal * 0.05).toFixed(2));
    const cafeNet = Number((cafeShare + tax).toFixed(2));

    let status = "Clear";
    let settlementAmount = 0;

    if (codAmount > vendorShare) {
      status = "Cafe Should Receive";
      settlementAmount = Number((codAmount - vendorShare).toFixed(2));
    } else if (codAmount < vendorShare) {
      status = "Cafe Should Pay";
      settlementAmount = Number((vendorShare - codAmount).toFixed(2));
    }

    return Response.json({
      success: true,
      vendor: {
        id: vendor._id,
        name: vendor.Vendor_Name,
        trainscafeCommision: vendor.trainscafeCommision,
      },
      dateRange: { startDate, endDate },
      dailySettlement: Object.entries(daily).map(([date, val]) => ({
        date,
        ...val,
      })),
      summary: {
        onlineAmount,
        codAmount,
        vendorShare,
        cafeShare,
        tax,
        cafeNet,
        settlementAmount,
        status,
      },
      isPaid: false,

      overlap: overlapSettlement
        ? {
            startDate: overlapSettlement.startDate,
            endDate: overlapSettlement.endDate,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Settlement error" },
      { status: 500 }
    );
  }
}
