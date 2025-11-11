// // // // import { NextResponse } from "next/server";
// // // // import dbConnect from "@/app/lib/dbConnect";
// // // // import Order from "@/app/models/order"; // ✅ use Order model

// // // // export async function GET() {
// // // //   try {
// // // //     await dbConnect();

// // // //     const now = new Date();

// // // //     // Calculate pure UTC date ranges
// // // //     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
// // // //     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

// // // //     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
// // // //     const endOfYesterdayUTC = startOfTodayUTC;

// // // //     // ✅ Aggregate Today’s Sales
// // // //     const todaySalesAgg = await Order.aggregate([
// // // //       {
// // // //         $match: {
// // // //           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
// // // //           status: "placed" // only confirmed/placed orders
// // // //         }
// // // //       },
// // // //       {
// // // //         $group: {
// // // //           _id: null,
// // // //           totalSales: { $sum: "$total" },
// // // //           totalOrders: { $sum: 1 }
// // // //         }
// // // //       }
// // // //     ]);

// // // //     // ✅ Aggregate Yesterday’s Sales
// // // //     const yesterdaySalesAgg = await Order.aggregate([
// // // //       {
// // // //         $match: {
// // // //           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
// // // //           status: "placed"
// // // //         }
// // // //       },
// // // //       {
// // // //         $group: {
// // // //           _id: null,
// // // //           totalSales: { $sum: "$total" },
// // // //           totalOrders: { $sum: 1 }
// // // //         }
// // // //       }
// // // //     ]);

// // // //     const todaySales = todaySalesAgg[0]?.totalSales || 0;
// // // //     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
// // // //     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
// // // //     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

// // // //     // Percentage change logic
// // // //     const percentageChange =
// // // //       yesterdaySales === 0
// // // //         ? "0.00"
// // // //         : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);

// // // //     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

// // // //     return NextResponse.json({
// // // //       todaySales: parseFloat(todaySales.toFixed(2)),
// // // //       yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
// // // //       todayOrders,
// // // //       yesterdayOrders,
// // // //       percentageChange,
// // // //       status,
// // // //       dateRange: {
// // // //         today: { start: startOfTodayUTC, end: endOfTodayUTC },
// // // //         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC }
// // // //       }
// // // //     });
// // // //   } catch (err) {
// // // //     console.error("Error fetching order summary:", err);
// // // //     return NextResponse.json({ error: err.message }, { status: 500 });
// // // //   }
// // // // }
// // // import { NextResponse } from "next/server";
// // // import dbConnect from "@/app/lib/dbConnect";
// // // import Order from "@/app/models/order";
// // // import Vendor from "@/app/models/vendor";
// // // import Menu from "@/app/models/menu";

// // // export async function GET() {
// // //   try {
// // //     await dbConnect();

// // //     const now = new Date();

// // //     // Pure UTC ranges for today & yesterday
// // //     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
// // //     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

// // //     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
// // //     const endOfYesterdayUTC = startOfTodayUTC;

// // //     // ✅ 1️⃣ Aggregate Today's Sales
// // //     const todaySalesAgg = await Order.aggregate([
// // //       {
// // //         $match: {
// // //           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
// // //           status: "placed"
// // //         }
// // //       },
// // //       {
// // //         $group: {
// // //           _id: null,
// // //           totalSales: { $sum: "$total" },
// // //           totalOrders: { $sum: 1 }
// // //         }
// // //       }
// // //     ]);

// // //     // ✅ 2️⃣ Aggregate Yesterday's Sales
// // //     const yesterdaySalesAgg = await Order.aggregate([
// // //       {
// // //         $match: {
// // //           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
// // //           status: "placed"
// // //         }
// // //       },
// // //       {
// // //         $group: {
// // //           _id: null,
// // //           totalSales: { $sum: "$total" },
// // //           totalOrders: { $sum: 1 }
// // //         }
// // //       }
// // //     ]);

// // //     // ✅ 3️⃣ Overall counts (no filters)
// // //     const [totalVendors, totalMenus, totalOrders] = await Promise.all([
// // //       Vendor.countDocuments(),
// // //       Menu.countDocuments(),
// // //       Order.countDocuments()
// // //     ]);

// // //     // Extract results
// // //     const todaySales = todaySalesAgg[0]?.totalSales || 0;
// // //     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
// // //     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
// // //     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

// // //     // Calculate percentage change
// // //     const percentageChange =
// // //       yesterdaySales === 0
// // //         ? "0.00"
// // //         : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);

// // //     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

// // //     // ✅ Final JSON response
// // //     return NextResponse.json({
// // //       summary: {
// // //         todaySales: parseFloat(todaySales.toFixed(2)),
// // //         yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
// // //         todayOrders,
// // //         yesterdayOrders,
// // //         percentageChange,
// // //         status
// // //       },
// // //       totals: {
// // //         vendors: totalVendors,
// // //         menus: totalMenus,
// // //         orders: totalOrders
// // //       },
// // //       dateRange: {
// // //         today: { start: startOfTodayUTC, end: endOfTodayUTC },
// // //         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC }
// // //       }
// // //     });
// // //   } catch (err) {
// // //     console.error("Error fetching order summary:", err);
// // //     return NextResponse.json({ error: err.message }, { status: 500 });
// // //   }
// // // }


// // import { NextResponse } from "next/server";
// // import dbConnect from "@/app/lib/dbConnect";
// // import Order from "@/app/models/order";
// // import Vendor from "@/app/models/vendor";
// // import Menu from "@/app/models/menu";

// // export async function GET() {
// //   try {
// //     await dbConnect();

// //     const now = new Date();

// //     // UTC date ranges
// //     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
// //     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
// //     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
// //     const endOfYesterdayUTC = startOfTodayUTC;

// //     // ✅ Today’s Sales
// //     const todaySalesAgg = await Order.aggregate([
// //       {
// //         $match: {
// //           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
// //           status: "placed",
// //         },
// //       },
// //       {
// //         $group: {
// //           _id: null,
// //           totalSales: { $sum: "$payment.amount" },
// //           totalOrders: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     // ✅ Yesterday’s Sales
// //     const yesterdaySalesAgg = await Order.aggregate([
// //       {
// //         $match: {
// //           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
// //           status: "placed",
// //         },
// //       },
// //       {
// //         $group: {
// //           _id: null,
// //           totalSales: { $sum: "$payment.amount" },
// //           totalOrders: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     // ✅ Total counts
// //     const [totalVendors, totalMenus, totalOrders] = await Promise.all([
// //       Vendor.countDocuments(),
// //       Menu.countDocuments(),
// //       Order.countDocuments(),
// //     ]);

// //     // ✅ COD vs Online (count + amount)
// //     const codVsOnline = await Order.aggregate([
// //       {
// //         $group: {
// //           _id: "$payment.payment_method",
// //           count: { $sum: 1 },
// //           totalAmount: { $sum: "$payment.amount" },
// //         },
// //       },
// //     ]);

// //     const codData = codVsOnline.find((i) => i._id === "COD") || { count: 0, totalAmount: 0 };
// //     const onlineData = codVsOnline.find((i) => i._id === "RAZORPAY") || { count: 0, totalAmount: 0 };
// //     const totalPaymentCount = codData.count + onlineData.count;
// //     const codPercentage = totalPaymentCount ? ((codData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";
// //     const onlinePercentage = totalPaymentCount ? ((onlineData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";

// //     // ✅ Delivered vs Cancel
// //     const deliveredVsCancel = await Order.aggregate([
// //       {
// //         $match: { status: { $in: ["delivered", "cancel"] } },
// //       },
// //       {
// //         $group: {
// //           _id: "$status",
// //           count: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     const deliveredCount = deliveredVsCancel.find((i) => i._id === "delivered")?.count || 0;
// //     const cancelCount = deliveredVsCancel.find((i) => i._id === "cancel")?.count || 0;
// //     const totalStatusCount = deliveredCount + cancelCount;
// //     const deliveredPercentage = totalStatusCount ? ((deliveredCount / totalStatusCount) * 100).toFixed(2) : "0.00";
// //     const cancelPercentage = totalStatusCount ? ((cancelCount / totalStatusCount) * 100).toFixed(2) : "0.00";

// //     // ✅ Sales data
// //     const todaySales = todaySalesAgg[0]?.totalSales || 0;
// //     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
// //     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
// //     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

// //     // ✅ Sales growth %
// //     const percentageChange =
// //       yesterdaySales === 0 ? "0.00" : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);
// //     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

// //     // ✅ Final Response
// //     return NextResponse.json({
// //       summary: {
// //         todaySales: parseFloat(todaySales.toFixed(2)),
// //         yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
// //         todayOrders,
// //         yesterdayOrders,
// //         percentageChange,
// //         status,
// //       },
// //       totals: {
// //         vendors: totalVendors,
// //         menus: totalMenus,
// //         orders: totalOrders,
// //       },
// //       paymentStats: {
// //         cod: codData.count,
// //         online: onlineData.count,
// //         codAmount: parseFloat(codData.totalAmount.toFixed(2)),
// //         onlineAmount: parseFloat(onlineData.totalAmount.toFixed(2)),
// //         codPercentage,
// //         onlinePercentage,
// //       },
// //       orderStatusStats: {
// //         delivered: deliveredCount,
// //         cancel: cancelCount,
// //         deliveredPercentage,
// //         cancelPercentage,
// //       },
// //       dateRange: {
// //         today: { start: startOfTodayUTC, end: endOfTodayUTC },
// //         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC },
// //       },
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

//     // ✅ UTC Date Ranges
//     const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
//     const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
//     const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
//     const endOfYesterdayUTC = startOfTodayUTC;

//     // ✅ Today’s Sales
//     const todaySalesAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
//           status: "placed",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$payment.amount" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     // ✅ Yesterday’s Sales
//     const yesterdaySalesAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfYesterdayUTC, $lt: endOfYesterdayUTC },
//           status: "placed",
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           totalSales: { $sum: "$payment.amount" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//     ]);

//     // ✅ Total counts
//     const [totalVendors, totalMenus, totalOrders] = await Promise.all([
//       Vendor.countDocuments(),
//       Menu.countDocuments(),
//       Order.countDocuments(),
//     ]);

//     // ✅ COD vs Online Payment Stats
//     const codVsOnline = await Order.aggregate([
//       {
//         $group: {
//           _id: "$payment.payment_method",
//           count: { $sum: 1 },
//           totalAmount: { $sum: "$payment.amount" },
//         },
//       },
//     ]);

//     const codData = codVsOnline.find((i) => i._id === "COD") || { count: 0, totalAmount: 0 };
//     const onlineData = codVsOnline.find((i) => i._id === "RAZORPAY") || { count: 0, totalAmount: 0 };
//     const totalPaymentCount = codData.count + onlineData.count;
//     const codPercentage = totalPaymentCount ? ((codData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";
//     const onlinePercentage = totalPaymentCount ? ((onlineData.count / totalPaymentCount) * 100).toFixed(2) : "0.00";

//     // ✅ Delivered vs Cancel Orders
//     const deliveredVsCancel = await Order.aggregate([
//       {
//         $match: { status: { $in: ["delivered", "cancel"] } },
//       },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     const deliveredCount = deliveredVsCancel.find((i) => i._id === "delivered")?.count || 0;
//     const cancelCount = deliveredVsCancel.find((i) => i._id === "cancel")?.count || 0;
//     const totalStatusCount = deliveredCount + cancelCount;
//     const deliveredPercentage = totalStatusCount ? ((deliveredCount / totalStatusCount) * 100).toFixed(2) : "0.00";
//     const cancelPercentage = totalStatusCount ? ((cancelCount / totalStatusCount) * 100).toFixed(2) : "0.00";

//     // ✅ Monthly Sales (Jan–Dec)
//     const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
//     const endOfYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));

//     const monthlySalesAgg = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: startOfYear, $lt: endOfYear },
//           status: "placed",
//         },
//       },
//       {
//         $group: {
//           _id: { month: { $month: "$createdAt" } },
//           totalSales: { $sum: "$payment.amount" },
//           totalOrders: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { "_id.month": 1 },
//       },
//     ]);

//     const monthNames = [
//       "January", "February", "March", "April", "May", "June",
//       "July", "August", "September", "October", "November", "December",
//     ];

//     const monthlySales = monthNames.map((month, index) => {
//       const data = monthlySalesAgg.find((m) => m._id.month === index + 1);
//       return {
//         month,
//         totalSales: data?.totalSales?.toFixed(2) || "0.00",
//         totalOrders: data?.totalOrders || 0,
//       };
//     });

//     // ✅ Sales Summary
//     const todaySales = todaySalesAgg[0]?.totalSales || 0;
//     const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;
//     const todayOrders = todaySalesAgg[0]?.totalOrders || 0;
//     const yesterdayOrders = yesterdaySalesAgg[0]?.totalOrders || 0;

//     const percentageChange =
//       yesterdaySales === 0 ? "0.00" : (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2);
//     const status = todaySales >= yesterdaySales ? "increase" : "decrease";

//     // ✅ Final Response
//     return NextResponse.json({
//       summary: {
//         todaySales: parseFloat(todaySales.toFixed(2)),
//         yesterdaySales: parseFloat(yesterdaySales.toFixed(2)),
//         todayOrders,
//         yesterdayOrders,
//         percentageChange,
//         status,
//       },
//       totals: {
//         vendors: totalVendors,
//         menus: totalMenus,
//         orders: totalOrders,
//       },
//       paymentStats: {
//         cod: codData.count,
//         online: onlineData.count,
//         codAmount: parseFloat(codData.totalAmount.toFixed(2)),
//         onlineAmount: parseFloat(onlineData.totalAmount.toFixed(2)),
//         codPercentage,
//         onlinePercentage,
//       },
//       orderStatusStats: {
//         delivered: deliveredCount,
//         cancel: cancelCount,
//         deliveredPercentage,
//         cancelPercentage,
//       },
//       monthlySales, // ✅ Month-wise sales added
//       dateRange: {
//         today: { start: startOfTodayUTC, end: endOfTodayUTC },
//         yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC },
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching order summary:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import dbConnect from "@/app/lib/dbConnect";
// import Order from "@/app/models/order";
// import Vendor from "@/app/models/vendor";
// import Menu from "@/app/models/menu";
import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import Vendor from "@/app/models/vendor";
import Menu from "@/app/models/menu";
import Station from "@/app/models/station";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfTodayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));
    const startOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 0, 0, 0));
    const endOfYesterdayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1, 23, 59, 59));

    // ✅ 1. Today’s sales
    const todayAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfTodayUTC, $lte: endOfTodayUTC },
          status: "placed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$payment.amount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);
    const todaySales = todayAgg[0]?.totalSales || 0;
    const todayOrders = todayAgg[0]?.orderCount || 0;

    // ✅ 2. Yesterday’s sales
    const yesterdayAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYesterdayUTC, $lte: endOfYesterdayUTC },
          status: "placed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$payment.amount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);
    const yesterdaySales = yesterdayAgg[0]?.totalSales || 0;
    const yesterdayOrders = yesterdayAgg[0]?.orderCount || 0;

    // ✅ 3. Percentage change
    const percentageChange = yesterdaySales
      ? ((todaySales - yesterdaySales) / yesterdaySales) * 100
      : 0;
    const status =
      percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "same";

    // ✅ 4. Totals
    const [totalVendors, totalMenus, totalOrders] = await Promise.all([
      Vendor.countDocuments(),
      Menu.countDocuments(),
      Order.countDocuments(),
    ]);

    // ✅ 5. Payment type stats
    const codData = await Order.aggregate([
      { $match: { "payment.method": "COD" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$payment.amount" },
        },
      },
    ]);
    const onlineData = await Order.aggregate([
      { $match: { "payment.method": "Online" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$payment.amount" },
        },
      },
    ]);

    const codCount = codData[0]?.count || 0;
    const onlineCount = onlineData[0]?.count || 0;
    const codTotal = codData[0]?.totalAmount || 0;
    const onlineTotal = onlineData[0]?.totalAmount || 0;
    const totalPaymentCount = codCount + onlineCount;
    const codPercentage = totalPaymentCount ? ((codCount / totalPaymentCount) * 100).toFixed(1) : 0;
    const onlinePercentage = totalPaymentCount ? ((onlineCount / totalPaymentCount) * 100).toFixed(1) : 0;

    // ✅ 6. Order status stats
    const deliveredCount = await Order.countDocuments({ status: "delivered" });
    const cancelCount = await Order.countDocuments({ status: "cancel" });
    const totalStatusCount = deliveredCount + cancelCount;
    const deliveredPercentage = totalStatusCount ? ((deliveredCount / totalStatusCount) * 100).toFixed(1) : 0;
    const cancelPercentage = totalStatusCount ? ((cancelCount / totalStatusCount) * 100).toFixed(1) : 0;

    // ✅ 7. Monthly Sales (Jan–Dec)
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const endOfYear = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));

    const monthlySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lt: endOfYear },
          status: "placed",
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalSales: { $sum: "$payment.amount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const monthlySales = monthNames.map((month, index) => {
      const data = monthlySalesAgg.find((m) => m._id.month === index + 1);
      return {
        month,
        totalSales: data?.totalSales?.toFixed(2) || "0.00",
        totalOrders: data?.totalOrders || 0,
      };
    });

    // ✅ 8. Fetch all Pending Orders with full details
    const pendingOrders = await Order.find({ status: "pending" })
      .populate("vendor")
      .populate("station")
      .populate("user_details")
      .sort({ createdAt: -1 });

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
        cod: codCount,
        online: onlineCount,
        codAmount: parseFloat(codTotal.toFixed(2)),
        onlineAmount: parseFloat(onlineTotal.toFixed(2)),
        codPercentage,
        onlinePercentage,
      },
      orderStatusStats: {
        delivered: deliveredCount,
        cancel: cancelCount,
        deliveredPercentage,
        cancelPercentage,
      },
      monthlySales,
      pendingOrders, // 👈 all pending orders with full details
      dateRange: {
        today: { start: startOfTodayUTC, end: endOfTodayUTC },
        yesterday: { start: startOfYesterdayUTC, end: endOfYesterdayUTC },
      },
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
