import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getStaff } from "@/app/lib/sessionPermission";

const STATUSES = ["placed", "confirm", "cancel", "dispatch", "delivered"];

// PATCH /api/orders/status/:id  { status, reason? }
// Cancelling needs a reason; it is saved on the order and as a note with who did it.
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid order" }, { status: 400 });
    }
    const { status, reason } = await req.json();

    if (!STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: "Valid status is required" }, { status: 400 });
    }
    const why = String(reason || "").trim().slice(0, 500);
    if (status === "cancel" && why.length < 3) {
      return NextResponse.json({ success: false, message: "Please write why this order is being cancelled" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const staff = await getStaff(req);
    const by = staff?.name || staff?.email || "";
    const before = order.status;

    order.status = status;
    if (status === "delivered") {
      order.payment.payment_status = "paid";
    }
    if (status === "cancel") {
      order.cancelReason = why;
      order.notes.push({ kind: "cancel", text: `Cancelled: ${why}`, by });
    } else if (before === "cancel") {
      order.cancelReason = ""; // reopened
      order.notes.push({ kind: "status", text: `Reopened (now ${status})`, by });
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    }, { status: 500 });
  }
}
