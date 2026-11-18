import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";
import { MIN_PAISE, getRazorpay, razorpayFailure, toPaise } from "@/app/lib/razorpay";

const MAX_RUPEES = 100000;

// Standalone "create a Razorpay order" endpoint. Orders placed from the website create their
// Razorpay order inside /api/orders/place-order (so the amount always comes from the server's own
// price calculation); this one only validates the amount and returns the minimum the modal needs.
export async function POST(req) {
  const limit = rateLimit(req, { scope: "rp-create-order", limit: 10 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const body = await req.json().catch(() => ({}));
  const amount = toPaise(body?.amount);

  if (!Number.isFinite(amount) || amount < MIN_PAISE || amount > MAX_RUPEES * 100) {
    return NextResponse.json(
      { success: false, message: `Amount must be between Rs 1 and Rs ${MAX_RUPEES}` },
      { status: 400 }
    );
  }

  try {
    const order = await getRazorpay().orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });
    return NextResponse.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
    });
  } catch (error) {
    const { status, message } = razorpayFailure(error);
    console.error("Razorpay create-order failed:", error?.error?.description || error?.message);
    return NextResponse.json({ success: false, message }, { status });
  }
}
