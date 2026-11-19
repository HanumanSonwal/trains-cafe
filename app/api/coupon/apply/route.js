import { cartCalculation } from "@/app/lib";
import CouponUsage from "@/app/models/couponUsage";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";

// POST /api/coupon/apply  body: { code, phone, cart }
// Checks a coupon for this cart and mobile number and returns the discount.
// Place-order runs the same checks again, so this is only a preview.
export async function POST(req) {
  const limit = rateLimit(req, { scope: "coupon-apply", limit: 20 });
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  const fail = (message) => NextResponse.json({ success: false, message });

  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || "").trim().toUpperCase();
    const phone = String(body.phone || "").replace(/\D/g, "").slice(-10);
    const cart = body.cart;

    if (!code) return fail("Please enter a coupon code");
    if (!/^[6-9]\d{9}$/.test(phone)) return fail("Enter your 10 digit mobile number first");
    if (!Array.isArray(cart) || !cart.length) return fail("Your cart is empty");

    await dbConnect();

    const [coupon, used] = await Promise.all([
      Coupon.findOne({ code, status: "published" }).lean(),
      CouponUsage.exists({ code, phone }),
    ]);

    if (!coupon) return fail("This coupon code is not valid");
    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) return fail("This coupon has expired");
    if (used) return fail("You have already used this coupon");

    const { discount, subTotal, total, tax } = cartCalculation(cart, coupon);
    if (coupon.minimumAmount > subTotal) {
      return fail(`Add items worth ₹${Math.ceil(coupon.minimumAmount - subTotal)} more to use this coupon`);
    }

    return NextResponse.json({ success: true, code, discount, subTotal, total, tax });
  } catch (error) {
    console.error("Coupon apply failed:", error.message);
    return fail("Could not apply the coupon right now");
  }
}
