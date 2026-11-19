import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import Menu from "@/app/models/menu";
import { NextResponse } from "next/server";
import "@/app/models/vendor";
import "@/app/models/station";
import "@/app/models/category";
import dayjs from "dayjs";

const escapeRx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Admin orders list. The old version ran one OrderItems query (with two populates) per order,
// so a page of 10 orders cost 11+ round trips. Now the items of the whole page come in one query.
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10) || 10));
    const statusParam = searchParams.get("status")?.trim();
    const payment_statusParam = searchParams.get("payment_status")?.trim();
    const fromDate = searchParams.get("from")?.trim();
    const toDate = searchParams.get("to")?.trim();
    const search = (searchParams.get("search") || "").trim().slice(0, 60);

    await dbConnect();

    const filter = {};
    if (statusParam) filter.status = statusParam;
    if (payment_statusParam) filter["payment.payment_status"] = payment_statusParam;

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = dayjs(fromDate, "YYYY-MM-DD").startOf("day").toDate();
      if (toDate) filter.createdAt.$lte = dayjs(toDate, "YYYY-MM-DD").endOf("day").toDate();
    }

    if (search) {
      const rx = { $regex: escapeRx(search), $options: "i" };
      filter.$or = [
        { order_id: rx },
        { "user_details.mobile": rx },
        { "user_details.name": rx },
        { "train.train_number": rx },
        { "train.train_pnr": rx },
      ];
    }

    const orders = await Order.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
      lean: true,
      populate: [
        { path: "vendor", model: "vendor" },
        { path: "station", model: "Station" },
      ],
    });

    if (!orders || orders.docs.length === 0) {
      return NextResponse.json({ success: false, message: "Orders not found" });
    }

    // every item line of this page, in a single query
    const lines = await OrderItems.find({ Order_Id: { $in: orders.docs.map((o) => o._id) } })
      .populate({
        path: "Item_Id",
        model: Menu,
        select: "Item_Name image Price Food_Type Description Category_Id",
        populate: { path: "Category_Id", model: "Category", select: "title image" },
      })
      .lean();

    const itemsByOrder = new Map();
    for (const oi of lines) {
      if (!oi.Item_Id) continue;
      const key = String(oi.Order_Id);
      if (!itemsByOrder.has(key)) itemsByOrder.set(key, new Map());
      itemsByOrder.get(key).set(String(oi.Item_Id._id), {
        Quantity: oi.Quantity,
        Price: oi.Price,
        mainprice: oi.Item_Id.Price,
        MenuItem: {
          Item_Id: oi.Item_Id._id,
          Item_Name: oi.Item_Id.Item_Name,
          image: oi.Item_Id.image,
          Food_Type: oi.Item_Id.Food_Type,
          Description: oi.Item_Id.Description,
          Category: oi.Item_Id.Category_Id
            ? {
                Category_Id: oi.Item_Id.Category_Id._id,
                Title: oi.Item_Id.Category_Id.title,
                Image: oi.Item_Id.Category_Id.image,
              }
            : null,
        },
      });
    }

    const docs = orders.docs.map((order) => {
      const vendor = order.vendor || {};
      const total = order.total ?? 0;
      const advancedAmount = order.payment?.advanced ?? 0;
      const tax = Number(order.payment?.tax ?? 0);
      return {
        ...order,
        Vendor_Name: vendor.Vendor_Name || null,
        Vendor_Details: vendor,
        Station_Details: order.station || {},
        Items: [...(itemsByOrder.get(String(order._id))?.values() || [])],
        vendor: undefined,
        remainingAmount: Number((total - advancedAmount).toFixed(2)),
        advancedAmount,
        payment: { ...order.payment, tax: Number(tax.toFixed(2)) },
      };
    });

    return NextResponse.json({
      success: true,
      totalDocs: orders.totalDocs,
      limit: orders.limit,
      page: orders.page,
      totalPages: orders.totalPages,
      docs,
    });
  } catch (error) {
    console.error("Orders list failed:", error.message);
    return NextResponse.json({ success: false, message: "Could not load orders" });
  }
}
