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

    const deliveredCount = await Order.countDocuments({ status: "delivered" });
    const cancelCount = await Order.countDocuments({ status: "cancel" });
    const totalStatusCount = deliveredCount + cancelCount;
    const deliveredPercentage = totalStatusCount ? ((deliveredCount / totalStatusCount) * 100).toFixed(1) : 0;
    const cancelPercentage = totalStatusCount ? ((cancelCount / totalStatusCount) * 100).toFixed(1) : 0;

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

    const pendingOrders = await Order.find({ status: "placed" })
      .populate("vendor")
      .populate("station")
      .populate("user_details")
      .sort({ createdAt: -1 });

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
      pendingOrders, 
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
