import Razorpay from "razorpay";

export async function POST(req) {
  const body = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: body.amount * 100,
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
