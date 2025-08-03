import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import dbConnect from "@/app/lib/dbConnect";
import order from "@/app/models/order";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    await order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "payment.payment_method": "RAZORPAY",
          "payment.payment_status": "paid",
          "payment.razorpay_order_id": razorpay_order_id,
          "payment.razorpay_payment_id": razorpay_payment_id,
          "payment.razorpay_signature": razorpay_signature,
          status: "confirm", 
        },
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified and order updated.",
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error in payment verification." },
      { status: 500 }
    );
  }
}


