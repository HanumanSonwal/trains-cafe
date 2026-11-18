// Server-only Razorpay helpers. KEY_SECRET is read here and nowhere near client code.
import Razorpay from "razorpay";
import crypto from "crypto";

export const MIN_PAISE = 100; // Razorpay rejects orders below Rs 1

export class PaymentConfigError extends Error {
  constructor() {
    super("Online payment is not configured");
    this.name = "PaymentConfigError";
    this.status = 503;
  }
}

let client = null;
export function getRazorpay() {
  if (client) return client;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new PaymentConfigError();
  client = new Razorpay({ key_id, key_secret });
  return client;
}

export const toPaise = (rupees) => Math.round(Number(rupees) * 100);

/** HTTP status and a safe message for an error thrown by the Razorpay SDK (never leaks details). */
export function razorpayFailure(err) {
  if (err instanceof PaymentConfigError) return { status: 503, message: err.message };
  if (err?.statusCode === 401) return { status: 401, message: "Online payment is temporarily unavailable" };
  return { status: 500, message: "Could not start the payment. Please try again" };
}

/**
 * Checks the signature Razorpay returns after a payment:
 * HMAC-SHA256("<order_id>|<payment_id>", KEY_SECRET), compared in constant time.
 */
export function verifySignature({ orderId, paymentId, signature }) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !orderId || !paymentId || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest();
  let given;
  try {
    given = Buffer.from(String(signature), "hex");
  } catch {
    return false;
  }
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}
