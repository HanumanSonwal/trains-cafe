
import dbConnect from "@/app/lib/dbConnect";
import VendorModel from "@/app/models/vendor";
import StationModel from "@/app/models/station";
import OrderModel from "@/app/models/order";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const stationcode = url.searchParams.get("stationcode")?.trim();
    const vendorid = url.searchParams.get("vendorid")?.trim();
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const limit = parseInt(url.searchParams.get("limit"), 10) || 10;
    const flag = url.searchParams.get("flag")?.trim();

    await dbConnect();

    let query = {};

    if (stationcode) {
      const station = await StationModel.findOne({
        code: { $regex: stationcode, $options: "i" },
      });

      if (!station) {
        return new Response(
          JSON.stringify({ success: false, message: "Station not found" }),
          { status: 404 }
        );
      }
      query.Station = station._id;
    }

    if (vendorid) {
      query._id = vendorid;
    }

    const total = await VendorModel.countDocuments(query);
    const skip = (page - 1) * limit;

    // If flag=1, skip fetching vendors completely
    let mappedVendors = undefined;
    if (flag !== "1") {
      const vendors = await VendorModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate("Station", "name code");

      if (vendors.length === 0) {
        return new Response(
          JSON.stringify({ success: false, message: "No vendors found" }),
          { status: 404 }
        );
      }

      mappedVendors = [];
      for (const vendor of vendors) {
        let onlineAmount = 0;
        let codAmount = 0;
        let sumSubTotals = 0;
        let sumDiscounts = 0;

        const orders = await OrderModel.find({ vendor: vendor._id });

        for (const order of orders) {
          const subTotal = Number(order.subTotal || 0);
          const discount = Number(order.totalDiscount || 0);

          sumSubTotals += subTotal;
          sumDiscounts += discount;

          const total = Number(order.total || subTotal);
          const advanced = Number(order.payment?.advanced || 0);
          const method = order.payment?.payment_method;

          if (method === "RAZORPAY" || method === "Online") {
            onlineAmount += total;
          } else if (method === "COD") {
            if (advanced > 0) {
              onlineAmount += advanced;
              codAmount += total - advanced;
            } else {
              codAmount += total;
            }
          }
        }

        const totalEffective = onlineAmount + codAmount;

        const cafePercent = Number(vendor.trainscafeCommision || 0);
        const vendorPercent = 100 - cafePercent;

        const vendorShare = Number(((sumSubTotals * vendorPercent) / 100).toFixed(2));
        const cafeCommissionRaw = (sumSubTotals * cafePercent) / 100;
        const cafeShare = Number((cafeCommissionRaw - sumDiscounts).toFixed(2));
        const tax = Number((sumSubTotals * 0.05).toFixed(2));
        const cafeNet = Number((cafeShare + tax).toFixed(2));

        let settlementStatus = "";
        let settlementAmount = 0;

        if (codAmount > vendorShare) {
          settlementStatus = "Cafe Should Receive";
          settlementAmount = Number((codAmount - vendorShare).toFixed(2));
        } else if (codAmount < vendorShare) {
          settlementStatus = "Cafe Should Pay";
          settlementAmount = Number((vendorShare - codAmount).toFixed(2));
        } else {
          settlementStatus = "Clear";
          settlementAmount = 0;
        }

        mappedVendors.push({
          vendorId: vendor._id,
          vendorName: vendor.Vendor_Name,
          Station_Name: vendor.Station?.name || "Unknown",
          Station_Code: vendor.Station?.code || "Unknown",

          Online_Total: Number(onlineAmount.toFixed(2)),
          COD_Total: Number(codAmount.toFixed(2)),
          Total_Effective_Amount: Number(totalEffective.toFixed(2)),

          Vendor_Share: vendorShare,
          Cafe_Share: cafeShare,
          Tax: tax,
          Cafe_Net: cafeNet,

          Cafe_Commission_Percent: cafePercent,
          Vendor_Commission_Percent: vendorPercent,

          Settlement_Status: settlementStatus,
          Settlement_Amount: settlementAmount,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        flag: flag || null,
        data: mappedVendors, // undefined if flag=1
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching vendors" }),
      { status: 500 }
    );
  }
}