import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import Vendor from "@/app/models/vendor";

export async function GET() {
  try {
    await dbConnect();

    // Only consider successful (delivered) orders
    const orders = await Order.find({ status: "delivered" })
      .populate("vendor", "name station")
      .lean();

    let totalOnlineReceived = 0;
    let totalCODCollected = 0;
    let totalCommission = 0;

    const vendorSummary = {};

    for (const order of orders) {
      const amount = order.payment?.amount || order.total || 0;
      const paymentMethod = order.payment?.payment_method || "UNKNOWN";
      const vendorId = order.vendor?._id?.toString();

      if (!vendorId) continue;

      // Commission: 20% of menu price (or order total)
      const commission = amount * 0.2;
      totalCommission += commission;

      if (!vendorSummary[vendorId]) {
        vendorSummary[vendorId] = {
          vendorName: order.vendor?.name || "Unknown Vendor",
          station: order.vendor?.station || "Unknown",
          codAmount: 0,
          onlineAmount: 0,
          commission: 0,
          vendorGets: 0,
          vendorOwes: 0,
        };
      }

      // Payment calculation logic
      if (paymentMethod === "ONLINE") {
        // You received money → you owe vendor 80%
        totalOnlineReceived += amount;
        vendorSummary[vendorId].onlineAmount += amount;
        vendorSummary[vendorId].vendorGets += amount * 0.8; // vendor’s share
      } else if (paymentMethod === "COD") {
        // Vendor received money → vendor owes you 20%
        totalCODCollected += amount;
        vendorSummary[vendorId].codAmount += amount;
        vendorSummary[vendorId].vendorOwes += commission; // your share
      }

      vendorSummary[vendorId].commission += commission;
    }

    const vendorList = Object.values(vendorSummary);

    const result = {
      totals: {
        totalOnlineReceived: parseFloat(totalOnlineReceived.toFixed(2)),
        totalCODCollected: parseFloat(totalCODCollected.toFixed(2)),
        totalCommission: parseFloat(totalCommission.toFixed(2)),
        totalVendors: vendorList.length,
      },
      vendors: vendorList,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating vendor finance summary:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
