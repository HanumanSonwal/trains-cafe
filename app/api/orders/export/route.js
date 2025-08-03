import dbConnect from '@/app/lib/dbConnect';
import Order from '@/app/models/order';
import OrderItems from '@/app/models/orderItems';
import Menu from '@/app/models/menu';
import { NextResponse } from 'next/server';
import '@/app/models/vendor';
import '@/app/models/station';
import '@/app/models/category';
import * as XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status")?.trim();
    const paymentStatusParam = searchParams.get("payment_status")?.trim();
    const fromDateParam = searchParams.get("from")?.trim();
    const toDateParam = searchParams.get("to")?.trim();
    const format = searchParams.get("format")?.trim();

    const filters = {};
    if (statusParam && statusParam !== 'All') {
      filters.status = statusParam;
    }
    if (paymentStatusParam && paymentStatusParam !== 'All') {
      filters['payment.payment_status'] = paymentStatusParam;
    }
    if (fromDateParam || toDateParam) {
      filters.createdAt = {};
      if (fromDateParam) filters.createdAt.$gte = new Date(fromDateParam);
      if (toDateParam) {
        const end = new Date(toDateParam);
        end.setHours(23, 59, 59, 999);
        filters.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .populate('vendor')
      .populate('station');

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const orderItems = await OrderItems.find({ Order_Id: order._id }).populate({
          path: 'Item_Id',
          model: Menu,
          select: 'Item_Name',
        });

        const items = orderItems.map((oi) => ({
          Item_Name: oi.Item_Id?.Item_Name || '',
          Quantity: oi.Quantity,
          Price: oi.Price,
        }));

        return {
          Order_ID: order.order_id || order._id.toString(),
          Vendor: order.vendor?.Vendor_Name || 'N/A',
          Station: `${order.station?.name || 'N/A'} (${order.station?.code || '-'})`,
          Status: order.status || 'N/A',
          Payment_Status: order.payment?.payment_status || 'N/A',
          Payment_Method: order.payment?.payment_method || 'N/A',
          SubTotal: order.subTotal || 0,
          Tax: order.payment?.tax || 0,
          Coupon: order.couponAmount || 0,
          Total: order.total || 0,
          CreatedAt: order.createdAt ? order.createdAt.toISOString().slice(0, 10) : 'N/A',
          Items: items.map(i => `${i.Item_Name} (x${i.Quantity})`).join(', ')
        };
      })
    );

    // === XLSX EXPORT ===
    if (format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(enrichedOrders);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="orders.xlsx"',
        },
      });
    }

    // === PDF EXPORT ===
    if (format === 'pdf') {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      const templatePath = path.join(process.cwd(),  'templates', 'template.html');
      let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

      const tableRows = enrichedOrders.map((o, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${o.Order_ID}</td>
          <td>${o.Vendor}</td>
          <td>${o.Station}</td>
          <td>${o.Status}</td>
          <td>${o.Payment_Status} (${o.Payment_Method})</td>
          <td>₹${o.SubTotal.toFixed(2)}</td>
          <td>₹${o.Tax.toFixed(2)}</td>
          <td>₹${o.Coupon.toFixed(2)}</td>
          <td>₹${o.Total.toFixed(2)}</td>
          <td>${o.CreatedAt}</td>
          <td>${o.Items}</td>
        </tr>
      `).join('');

      htmlTemplate = htmlTemplate.replace('{{tableRows}}', tableRows);

      await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="orders.pdf"',
        },
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid format. Use 'format=pdf' or 'format=xlsx'.",
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
