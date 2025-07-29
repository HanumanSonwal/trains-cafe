import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { payment_status } = await req.json();

    if (!payment_status) {
      return NextResponse.json({ success: false, message: "payment_status is required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    order.payment.payment_status = payment_status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Payment status updated",
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    }, { status: 500 });
  }
}
