import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const order = await Order.findById(id)
      .populate("vendor")
      .populate("station")
      .lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const orderItemsRaw = await OrderItems.find({ Order_Id: order._id })
      .populate("Item_Id")
      .lean();

    const itemsMap = new Map();
    orderItemsRaw.forEach((item) => {
      const menu = item.Item_Id || {};
      const key = menu._id?.toString() || item._id.toString();
      if (!itemsMap.has(key)) {
        const price = item.Price !== undefined ? item.Price : menu.Price || 0;
        const quantity = item.Quantity || 0;
        itemsMap.set(key, {
          serial: itemsMap.size + 1,
          name: menu.Item_Name || "N/A",
          quantity,
          price,
          total: price * quantity,
        });
      }
    });

    const items = Array.from(itemsMap.values());

    const htmlPath = path.join(
      process.cwd(),
      "templates",
      "invoiceTemplate.html"
    );
    const htmlTemplate = fs.readFileSync(htmlPath, "utf-8");
    const compile = handlebars.compile(htmlTemplate);

    const coupon = order.couponAmount || 0;
    const adminDiscount = order.adminDiscountValue || 0;
    const deliveryCharge = order.vendor?.Delivery_Charges || 0;

    const discountedAmount = (order.subTotal || 0) - coupon - adminDiscount;
    const tax = discountedAmount * 0.05;
    const totalAmount = discountedAmount + tax + deliveryCharge;

    const html = compile({
      orderID: order.order_id || order._id,
      customerName: order.user_details?.name || "N/A",
      mobile: order.user_details?.mobile || "N/A",
      email: order.user_details?.email || "N/A",
      coach: order.user_details?.coach || "N/A",
      seat: order.user_details?.seatNo || "N/A",
      pnr: order.user_details?.pnr || "N/A",
      trainNumber:
        order.train?.train_number || order.user_details?.trainNo || "N/A",
      deliveryDate: new Date(order.createdAt).toLocaleDateString(),
      deliveryTime: new Date(order.createdAt).toLocaleTimeString(),
      station: order.station?.name || "N/A",
      paymentMethod: order.payment?.payment_method || "N/A",
      items,
      subTotal: order.subTotal || 0,
      discount: coupon.toFixed(2),
      adminDiscountValue: adminDiscount.toFixed(2),
      totalDiscount: (coupon + adminDiscount).toFixed(2),
      tax: tax.toFixed(2),
      deliveryCharge,
      total: totalAmount.toFixed(2),
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(
      `<style>
      body { font-family: Arial, sans-serif; }
      </style>` + html,
      { waitUntil: "networkidle0" }
    );

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${
          order.order_id || order._id
        }.pdf`,
      },
    });
  } catch (error) {
    console.error("❌ Invoice Generation Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
