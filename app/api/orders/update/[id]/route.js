import { cartCalculation } from "@/app/lib";
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const {
      user_details,
      train,
      payment,
      cart,
      vendor,
      station,
      couponCode,
      couponAmount = 0,
      adminDiscountPercent = 0,
      status,
      order_id,
    } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    let calculation = {};
    if (cart && Array.isArray(cart) && cart.length) {
      const couponObj =
        couponAmount > 0
          ? { discount: { type: "fixed", value: couponAmount } }
          : null;

      calculation = cartCalculation(cart, couponObj, adminDiscountPercent);
      await OrderItems.deleteMany({ Order_Id: order._id });
      const newItems = cart.map((item) => ({
        Order_Id: order._id,
        Item_Id: item._id,
        Quantity: item.quantity,
        Price: item.price,
      }));
      await OrderItems.insertMany(newItems);

      order.subTotal = calculation.subTotal;
      order.tax = calculation.tax;
      order.total = calculation.total;
      order.couponAmount = calculation.couponDiscount;
      order.adminDiscountValue = calculation.adminDiscountAmount;
      order.totalDiscount = calculation.discount;
    }

    if (typeof adminDiscountPercent !== "undefined")
      order.adminDiscountPercent = adminDiscountPercent;

    if (typeof status !== "undefined") order.status = status;
    if (typeof order_id !== "undefined") order.order_id = order_id;

    if (user_details)
      order.user_details = { ...order.user_details, ...user_details };
    if (train) order.train = { ...order.train, ...train };
    if (vendor) order.vendor = vendor;
    if (station) order.station = station;

    if (payment) {
      order.payment = {
        ...order.payment,
        ...payment,
        amount: order.total - (payment.advanced || 0),
        tax: order.tax,
      };
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
