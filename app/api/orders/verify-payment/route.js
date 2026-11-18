import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import Order from "@/app/models/order";
import { notifyOrderPlaced } from "@/app/lib/orderNotify";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";
import { getRazorpay, toPaise, verifySignature } from "@/app/lib/razorpay";

const fail = (message, status) => NextResponse.json({ success: false, message }, { status });

export async function POST(req) {
  const limit = rateLimit(req, { scope: "verify-payment", limit: 20 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      (await req.json().catch(() => null)) || {};

    const fields = [razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId];
    if (fields.some((f) => typeof f !== "string" || !f) || !mongoose.isValidObjectId(orderId)) {
      return fail("Missing or invalid payment details.", 400);
    }

    // 1. The signature proves Razorpay (not the browser) says this payment happened.
    if (!verifySignature({ orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature })) {
      return fail("Payment signature verification failed.", 400);
    }

    await dbConnect();
    const order = await Order.findById(orderId).select("rpOrderId total status payment");
    if (!order) return fail("Order not found.", 404);

    // 2. ...and that payment must belong to THIS order. Without this check someone could pay a
    //    Rs 1 order of their own and use its valid signature to "pay" any other order.
    if (order.rpOrderId) {
      if (order.rpOrderId !== razorpay_order_id) return fail("This payment does not belong to the order.", 400);
    } else {
      // Order placed before the link was stored: fall back to the amount Razorpay holds for it.
      const rpOrder = await getRazorpay().orders.fetch(razorpay_order_id);
      if (!rpOrder || rpOrder.amount !== toPaise(order.total)) {
        return fail("This payment does not match the order amount.", 400);
      }
    }

    // Safe to repeat: paying twice or a retried call changes nothing the second time.
    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          rpOrderId: razorpay_order_id,
          "payment.payment_method": "RAZORPAY",
          "payment.payment_status": "paid",
          "payment.rp_payement_id": razorpay_payment_id,
          // never move an order that staff already dispatched or delivered back to "confirm"
          status: order.status === "placed" ? "confirm" : order.status,
        },
      }
    );

    // Paid: now tell the vendor and the customer (sent once per order).
    await notifyOrderPlaced(order._id);

    return NextResponse.json({ success: true, message: "Payment verified and order updated." });
  } catch (error) {
    console.error("Payment verification error:", error?.error?.description || error?.message || error);
    return fail("Server error in payment verification.", 500);
  }
}
