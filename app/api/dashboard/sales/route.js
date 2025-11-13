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

    const startOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59
      )
    );
    const startOfYesterdayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        0,
        0,
        0
      )
    );
    const endOfYesterdayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - 1,
        23,
        59,
        59
      )
    );

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

    const ordersPercentage = yesterdayOrders
      ? (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(2)
      : 0;

    const earningsPercentage = yesterdaySales
      ? (((todaySales - yesterdaySales) / yesterdaySales) * 100).toFixed(2)
      : 0;

    const todayCustomersAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfTodayUTC, $lte: endOfTodayUTC },
          status: "placed",
        },
      },
      { $group: { _id: "$user_details" } },
    ]);

    const yesterdayCustomersAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYesterdayUTC, $lte: endOfYesterdayUTC },
          status: "placed",
        },
      },
      { $group: { _id: "$user_details" } },
    ]);

    const todayCustomers = todayCustomersAgg.length;
    const yesterdayCustomers = yesterdayCustomersAgg.length;

    const customerPercentage = yesterdayCustomers
      ? (
          ((todayCustomers - yesterdayCustomers) / yesterdayCustomers) *
          100
        ).toFixed(2)
      : 0;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();
    const monthName = monthNames[currentMonth];

    const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1));
    const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 1));

    const startOfPrevMonth = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1)
    );
    const endOfPrevMonth = new Date(Date.UTC(currentYear, currentMonth, 1));

    const currentMonthSalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
          status: "placed",
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$payment.amount" } } },
    ]);

    const previousMonthSalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfPrevMonth, $lt: endOfPrevMonth },
          status: "placed",
        },
      },
      { $group: { _id: null, totalSales: { $sum: "$payment.amount" } } },
    ]);

    const currentMonthSales = currentMonthSalesAgg[0]?.totalSales || 0;
    const previousMonthSales = previousMonthSalesAgg[0]?.totalSales || 0;

    const daysPassed = now.getUTCDate();
    const daysPrevMonth = new Date(currentYear, currentMonth, 0).getUTCDate();

    const currentAvg = currentMonthSales / daysPassed;
    const prevAvg = previousMonthSales / daysPrevMonth;

    const avgPercentage = prevAvg
      ? (((currentAvg - prevAvg) / prevAvg) * 100).toFixed(2)
      : 0;

    const [totalVendors, totalMenus, totalOrders] = await Promise.all([
      Vendor.countDocuments(),
      Menu.countDocuments(),
      Order.countDocuments(),
    ]);

    const codData = await Order.aggregate([
      { $match: { "payment.payment_method": "COD" } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$payment.amount" },
        },
      },
    ]);

    const onlineData = await Order.aggregate([
      {
        $match: {
          "payment.payment_method": {
            $in: ["UPI", "Card", "Netbanking", "RAZORPAY"],
          },
        },
      },
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

    const codPercentage = totalPaymentCount
      ? ((codCount / totalPaymentCount) * 100).toFixed(1)
      : 0;

    const onlinePercentage = totalPaymentCount
      ? ((onlineCount / totalPaymentCount) * 100).toFixed(1)
      : 0;

    const deliveredCount = await Order.countDocuments({ status: "delivered" });
    const cancelCount = await Order.countDocuments({ status: "cancel" });

    const totalStatusCount = deliveredCount + cancelCount;

    const deliveredPercentage = totalStatusCount
      ? ((deliveredCount / totalStatusCount) * 100).toFixed(1)
      : 0;

    const cancelPercentage = totalStatusCount
      ? ((cancelCount / totalStatusCount) * 100).toFixed(1)
      : 0;

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

      summaryCards: {
        todaysOrders: {
          count: todayOrders,
          percentage: ordersPercentage,
          compareText: "Since yesterday",
        },
        todaysEarnings: {
          amount: todaySales.toFixed(2),
          percentage: earningsPercentage,
          compareText: "Since yesterday",
        },
        todaysCustomers: {
          count: todayCustomers,
          percentage: customerPercentage,
          compareText: "Since yesterday",
        },
        monthlyAverageEarnings: {
          title: `Average Daily Earnings (${monthName})`,
          amount: currentAvg.toFixed(2),
          percentage: avgPercentage,
          compareText: "Since previous month",
        },
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
