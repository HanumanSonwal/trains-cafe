import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { user_details, train, payment, cart , vendor, station} = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (user_details) order.user_details = { ...order.user_details, ...user_details };
    if (train) order.train = { ...order.train, ...train };
    if (payment) order.payment = { ...order.payment, ...payment };
    if (vendor) order.vendor = vendor;
    if (station) order.station = station;

    if (cart && Array.isArray(cart)) {
      await OrderItems.deleteMany({ Order_Id: order._id });

      const newItems = cart.map((item) => ({
        Order_Id: order._id,
        Item_Id: item._id,
        Quantity: item.quantity,
        Price: item.price,
      }));

      await OrderItems.insertMany(newItems);
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    }, { status: 500 });
  }
}

