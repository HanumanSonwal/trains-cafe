
import dbConnect from "@/app/lib/dbConnect";
import OrderModel from "@/app/models/order";
import VendorModel from "@/app/models/vendor";
import Settlement from "@/app/models/settlement";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorid");
    let startDate = searchParams.get("startDate");
    let endDate = searchParams.get("endDate");

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID required" },
        { status: 400 }
      );
    }

    // -----------------------------
    // Parse Dates
    // -----------------------------
    if (!startDate || !endDate) {
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
    }

    const startUTC = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), 0, 0, 0));
    const endUTC = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 23, 59, 59, 999));

    // -----------------------------
    // Check last PAID settlement
    // -----------------------------
    const lastPaid = await Settlement.findOne({ vendor: vendorId, isPaid: true })
      .sort({ endDate: -1 });

    let message = null;
    let finalStart = new Date(startUTC);

    if (lastPaid) {
      const lastEnd = new Date(Date.UTC(
        lastPaid.endDate.getUTCFullYear(),
        lastPaid.endDate.getUTCMonth(),
        lastPaid.endDate.getUTCDate(),
        23, 59, 59, 999
      ));

      const nextStart = new Date(lastEnd);
      nextStart.setUTCDate(nextStart.getUTCDate() + 1);
      nextStart.setUTCHours(0, 0, 0, 0);

      finalStart = nextStart;

      message =
        `Your settlement is already done till ${lastEnd.toISOString().split("T")[0]}. ` +
        `Remaining is from ${finalStart.toISOString().split("T")[0]} to ${endUTC.toISOString().split("T")[0]}.`;
    }

    // -----------------------------
    // Fetch Orders
    // -----------------------------
    const orders = await OrderModel.find({
      vendor: vendorId,
      createdAt: { $gte: finalStart, $lte: endUTC },
    }).lean();

    const vendor = await VendorModel.findById(vendorId);
    const cafePercent = Number(vendor.trainscafeCommision || 0);

    // -----------------------------
    // ❗ If NO ORDERS → Return NULL DATA (Your requirement)
    // -----------------------------
    if (orders.length === 0) {
      return NextResponse.json({
        success: true,
        message: message,
        vendor: {
          id: vendor._id,
          name: vendor.Vendor_Name,
          trainscafeCommision: cafePercent
        },
        dateRange: { startDate: finalStart, endDate: endUTC },

        dailySettlement: null,   // 👈 REQUIRED
        summary: null,           // 👈 REQUIRED

        isPaid: false,
        lastSettledDate: lastPaid ? lastPaid.endDate : null,
      });
    }

    // -----------------------------
    // GROUP ORDERS BY DATE
    // -----------------------------
    const grouped = {};
    orders.forEach(order => {
      const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(order);
    });

    // Generate list of all dates
    const allDates = [];
    let current = new Date(finalStart);
    while (current <= endUTC) {
      allDates.push(current.toISOString().split("T")[0]);
      current.setUTCDate(current.getUTCDate() + 1);
    }

    // -----------------------------
    // DAILY CALCULATIONS
    // -----------------------------
    const dailySettlement = allDates.map(date => {
      const list = grouped[date] || [];

      let online = 0, cod = 0, subTotal = 0, taxTotal = 0, adminDiscountTotal = 0;

      list.forEach(order => {
        const st = Number(order.subTotal);
        const total = Number(order.total);
        const adminDiscount = Number(order.adminDiscountValue || 0);

        subTotal += st;
        adminDiscountTotal += adminDiscount;

        const remaining = st - adminDiscount;
        const tx = order.tax !== undefined ? Number(order.tax) : Number((remaining * 0.05).toFixed(2));
        taxTotal += tx;

        if (order.payment?.payment_method === "ONLINE") {
          online += total;
        } else {
          const adv = Number(order.payment?.advanced || 0);
          if (adv > 0) {
            online += adv;
            cod += (total - adv);
          } else {
            cod += total;
          }
        }
      });

      const vendorShare = Number((subTotal / (1 + cafePercent / 100)).toFixed(2));
      const cafeShare = Number((subTotal - vendorShare - adminDiscountTotal).toFixed(2));
      const cafeNet = Number((cafeShare + taxTotal).toFixed(2));

      return { date, online, cod, total: online + cod, subTotal, vendorShare, cafeShare, tax: taxTotal, cafeNet };
    });

    // -----------------------------
    // SUMMARY
    // -----------------------------
    let onlineAmount = 0, codAmount = 0, vendorTotal = 0, cafeShareTotal = 0, taxTotalSum = 0;

    dailySettlement.forEach(d => {
      onlineAmount += d.online;
      codAmount += d.cod;
      vendorTotal += d.vendorShare;
      cafeShareTotal += d.cafeShare;
      taxTotalSum += d.tax;
    });

    const cafeNetTotal = cafeShareTotal + taxTotalSum;

    let status = "Clear";
    let settlementAmount = 0;

    if (codAmount > vendorTotal) {
      status = "Cafe Should Receive";
      settlementAmount = Number((codAmount - vendorTotal).toFixed(2));
    } else if (codAmount < vendorTotal) {
      status = "Cafe Should Pay";
      settlementAmount = Number((vendorTotal - codAmount).toFixed(2));
    }

    return NextResponse.json({
      success: true,
      message,
      vendor: {
        id: vendor._id,
        name: vendor.Vendor_Name,
        trainscafeCommision: cafePercent,
      },
      dateRange: { startDate: finalStart, endDate: endUTC },
      dailySettlement,
      summary: {
        onlineAmount,
        codAmount,
        vendorShare: vendorTotal,
        cafeShare: cafeShareTotal,
        tax: taxTotalSum,
        cafeNet: cafeNetTotal,
        settlementAmount,
        status
      },
      isPaid: false,
      lastSettledDate: lastPaid ? lastPaid.endDate : null,
    });

  } catch (error) {
    console.error("Settlement Error:", error);
    return NextResponse.json(
      { success: false, message: "Settlement error" },
      { status: 500 }
    );
  }
}
