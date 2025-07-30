import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import Order from "@/app/models/order";

export async function GET(req, { params }) {
  const { id } = params;

  try {
    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" });
    }

    const items = Array.isArray(order.Items)
      ? order.Items.map((item, i) => {
          const menu = item.MenuItem || {};
          return {
            serial: i + 1,
            name: menu.Item_Name || "N/A",
            quantity: item.Quantity || 0,
            price: item.Price || 0,
            total: (item.Quantity || 0) * (item.Price || 0),
          };
        })
      : [];

      
    const htmlPath = path.join(process.cwd(), "templates", "invoiceTemplate.html");
    const htmlTemplate = fs.readFileSync(htmlPath, "utf-8");
    const compile = handlebars.compile(htmlTemplate);

    const html = compile({
      orderID: order.order_id || order._id,
      customerName: order.user_details?.name || "N/A",
      mobile: order.user_details?.mobile || "N/A",
      email: order.user_details?.email || "N/A",
      coach: order.user_details?.coach || "N/A",
      seat: order.user_details?.seatNo || "N/A",
      pnr: order.user_details?.pnr || "N/A",
      trainNumber: order.train?.train_number || order.user_details?.trainNo || "N/A",
      deliveryDate: new Date(order.createdAt).toLocaleDateString(),
      deliveryTime: new Date(order.createdAt).toLocaleTimeString(),
      station: order.Station_Details?.name || "N/A",
      paymentMethod: order.payment?.payment_method || "N/A",
      items,
      subTotal: order.subTotal || 0,
      discount: order.couponAmount || 0,
      deliveryCharge: order.Vendor_Details?.Delivery_Charges || 0,
      advance: 0,
      total: order.total || 0,
    });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${order.order_id || order._id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
