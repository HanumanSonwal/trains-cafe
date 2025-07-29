import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    order.status = status;

    if (status === "delivered") {
      order.payment.payment_status = "paid";
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
