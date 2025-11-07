// // import { NextResponse } from "next/server";
// // import dbConnect from "@/app/lib/dbConnect";
// // import Order from "@/app/models/order"; // ✅ use Order model

// // export async function GET() {
// //   try {
// //     await dbConnect();

// //     const now = new Date();

// //     // Calculate pure UTC date ranges
// //     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
// //     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

// //     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
// //     const endOfYesterdayUTC = startOfTodayUTC;

// //     // ✅ Aggregate Today’s Sales
// //     const todaySalesAgg = await Order.aggregate([
// //       {
// //         $match: {
// //           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
// //           status: "placed" // only confirmed/placed orders
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: null,
// //           totalSales: { $sum: "$total" },
// //           totalOrders: { $sum: 1 }
// //         }
// //       }
// //     ]);

// //     // ✅ Aggregate Yesterday’s Sales
// //     const yesterdaySalesAgg = await Order.aggregate([
// //       {
// //         $match: {
// //           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
// //           status: "placed"
// //         }
// //       },
// //       {
// //         $group: {
// //           _id: null,
// //           totalSales: { $sum: "$total" },
// //           totalOrders: { $sum: 1 }
// //         }
// //       }
// //     ]);

// //     const todaySales = todaySalesAgg[0]?.totalSales || 0;
// //     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
// //     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
// //     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

// //     // Percentage change logic
// //     const percentageChange =
// //       yesterdaySales === 0
// //         ? "0.00"
// //         : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);

// //     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

// //     return NextResponse.json({
// //       todaySales: parseFloat(todaySales.toFixed(2)),
// //       yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
// //       todayOrders,
// //       yesterdayOrders,
// //       percentageChange,
// //       status,
// //       dateRange: {
// //         today: { start: startOfTodayUTC, end: endOfTodayUTC },
// //         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC }
// //       }
// //     });
// //   } catch (err) {
// //     console.error("Error fetching order summary:", err);
// //     return NextResponse.json({ error: err.message }, { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbConnect";
// import Order from "@/app/models/order";
// import Vendor from "@/app/models/vendor";
// import Menu from "@/app/models/menu";

// export async function GET() {
//   try {
//     await dbConnect();

//     const now = new Date();

//     // Pure UTC ranges for today & yesterday
//     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

//     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
//     const endOfYesterdayUTC = startOfTodayUTC;

//     // ✅ 1️⃣ Aggregate Today's Sales
//     const todaySalesAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
//           status: "placed"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$total" },
//           totalOrders: { $sum: 1 }
//         }
//       }
//     ]);

//     // ✅ 2️⃣ Aggregate Yesterday's Sales
//     const yesterdaySalesAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
//           status: "placed"
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$total" },
//           totalOrders: { $sum: 1 }
//         }
//       }
//     ]);

//     // ✅ 3️⃣ Overall counts (no filters)
//     const [totalVendors, totalMenus, totalOrders] = await Promise.all([
//       Vendor.countDocuments(),
//       Menu.countDocuments(),
//       Order.countDocuments()
//     ]);

//     // Extract results
//     const todaySales = todaySalesAgg[0]?.totalSales || 0;
//     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
//     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
//     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

//     // Calculate percentage change
//     const percentageChange =
//       yesterdaySales === 0
//         ? "0.00"
//         : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);

//     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

//     // ✅ Final JSON response
//     return NextResponse.json({
//       summary: {
//         todaySales: parseFloat(todaySales.toFixed(2)),
//         yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
//         todayOrders,
//         yesterdayOrders,
//         percentageChange,
//         status
//       },
//       totals: {
//         vendors: totalVendors,
//         menus: totalMenus,
//         orders: totalOrders
//       },
//       dateRange: {
//         today: { start: startOfTodayUTC, end: endOfTodayUTC },
//         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC }
//       }
//     });
//   } catch (err) {
//     console.error("Error fetching order summary:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import Vendor from "@/app/models/vendor";
import Menu from "@/app/models/menu";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    // UTC date ranges
    const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
    const endOfYesterdayUTC = startOfTodayUTC;

    // ✅ Today’s Sales
    const todaySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
          status: "placed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$payment.amount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // ✅ Yesterday’s Sales
    const yesterdaySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
          status: "placed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$payment.amount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // ✅ Total counts
    const [totalVendors, totalMenus, totalOrders] = await Promise.all([
      Vendor.countDocuments(),
      Menu.countDocuments(),
      Order.countDocuments(),
    ]);

    // ✅ COD vs Online (count + amount)
    const codVsOnline = await Order.aggregate([
      {
        $group: {
          _id: "$payment.payment_method",
          count: { $sum: 1 },
          totalAmount: { $sum: "$payment.amount" },
        },
      },
    ]);

    const codData = codVsOnline.find((i) => i._id === "COD") || { count: 0, totalAmount: 0 };
    const onlineData = codVsOnline.find((i) => i._id === "RAZORPAY") || { count: 0, totalAmount: 0 };
    const totalPaymentCount = codData.count + onlineData.count;
    const codPercentage = totalPaymentCount ? ((codData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";
    const onlinePercentage = totalPaymentCount ? ((onlineData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";

    // ✅ Delivered vs Cancel
    const deliveredVsCancel = await Order.aggregate([
      {
        $match: { status: { $in: ["delivered", "cancel"] } },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const deliveredCount = deliveredVsCancel.find((i) => i._id === "delivered")?.count || 0;
    const cancelCount = deliveredVsCancel.find((i) => i._id === "cancel")?.count || 0;
    const totalStatusCount = deliveredCount + cancelCount;
    const deliveredPercentage = totalStatusCount ? ((deliveredCount / totalStatusCount) * 100).toFixed(2) : "0.00";
    const cancelPercentage = totalStatusCount ? ((cancelCount / totalStatusCount) * 100).toFixed(2) : "0.00";

    // ✅ Sales data
    const todaySales = todaySalesAgg[0]?.totalSales || 0;
    const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
    const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
    const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

    // ✅ Sales growth %
    const percentageChange =
      yesterdaySales === 0 ? "0.00" : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);
    const status = todaySales >= yesterdaySales ? "increase" : "decrease";

    // ✅ Final Response
    return NextResponse.json({
      summary: {
        todaySales: parseFloat(todaySales.toFixed(2)),
        yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
        todayOrders,
        yesterdayOrders,
        percentageChange,
        status,
      },
      totals: {
        vendors: totalVendors,
        menus: totalMenus,
        orders: totalOrders,
      },
      paymentStats: {
        cod: codData.count,
        online: onlineData.count,
        codAmount: parseFloat(codData.totalAmount.toFixed(2)),
        onlineAmount: parseFloat(onlineData.totalAmount.toFixed(2)),
        codPercentage,
        onlinePercentage,
      },
      orderStatusStats: {
        delivered: deliveredCount,
        cancel: cancelCount,
        deliveredPercentage,
        cancelPercentage,
      },
      dateRange: {
        today: { start: startOfTodayUTC, end: endOfTodayUTC },
        yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC },
      },
    });
  } catch (err) {
    console.error("Error fetching order summary:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

