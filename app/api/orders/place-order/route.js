import { cartCalculation } from "@/app/lib";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import Station from "@/app/models/station";
import CouponUsage from "@/app/models/couponUsage";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";
import { parsePhoneNumber } from "libphonenumber-js";
import * as EmailValidator from "email-validator";
import mongoose from "mongoose";
import Menu from "@/app/models/menu";
import Category from "@/app/models/category";
import { notifyOrderPlaced } from "@/app/lib/orderNotify";
import { resolveDeliveryDateTime } from "@/app/lib/orderMessage";
import { rateLimit, tooManyRequests } from "@/app/lib/rateLimit";
import sessionChecker from "@/app/lib/sessionPermission";
import { MIN_PAISE, getRazorpay, razorpayFailure, toPaise } from "@/app/lib/razorpay";

const MAX_QTY = 50;

/**
 * Website visitors must not set their own prices. Every item is looked up again in the database
 * (and must belong to the chosen vendor), and the price used is the one stored there.
 * Returns the trusted cart, or { error } when something does not add up.
 */
async function trustedCartFor(rawCart, vendorId) {
  if (!Array.isArray(rawCart) || !rawCart.length || rawCart.length > 100) return { error: "Your cart is empty" };
  if (!mongoose.isValidObjectId(vendorId)) return { error: "Invalid vendor" };

  const wanted = new Map(); // item id -> quantity (duplicates are added up)
  for (const line of rawCart) {
    const qty = Number(line?.quantity);
    if (!mongoose.isValidObjectId(line?._id) || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { error: "Invalid item in cart" };
    }
    wanted.set(String(line._id), Math.min(MAX_QTY, (wanted.get(String(line._id)) || 0) + qty));
  }

  const found = await Menu.find({ _id: { $in: [...wanted.keys()] }, Vendor: vendorId })
    .select("Price Final_Price")
    .lean();
  if (found.length !== wanted.size) return { error: "Some items are no longer available. Please refresh your cart" };

  return {
    cart: found.map((m) => {
      const unit = m.Final_Price ?? m.Price;
      return { _id: String(m._id), quantity: wanted.get(String(m._id)), price: unit, Final_Price: unit };
    }),
  };
}

export async function POST(req) {
  try {
    const limit = rateLimit(req, { scope: "place-order", limit: 10 });
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const {
      vendor,
      station,
      cacategory,
      train,
      payment,
      cart: rawCart,
      user_details,
      couponCode,
      adminDiscountPercent: requestedDiscount = 0,
      deliveryDateTime,
      orderSource: requestedSource,
    } = await req.json();

    if (!vendor || !station || !train || !payment || !user_details) {
      return NextResponse.json({
        success: false,
        message: "Invalid request. Required fields missing.",
      });
    }

    // Staff placing an order from the admin panel may set prices, discounts and the source.
    // Everyone else gets server-side prices, no extra discount, and source "website".
    const isStaff = await sessionChecker(req, "orders", true);
    let cart = rawCart;
    let adminDiscountPercent = 0;
    let orderSource = "website";
    if (isStaff) {
      adminDiscountPercent = Math.min(100, Math.max(0, Number(requestedDiscount) || 0));
      orderSource = requestedSource || "website";
    } else {
      const checked = await trustedCartFor(rawCart, vendor?._id);
      if (checked.error) return NextResponse.json({ success: false, message: checked.error });
      cart = checked.cart;
    }

    const { email, mobile } = user_details;

    if (!EmailValidator.validate(email)) {
      return NextResponse.json({
        success: false,
        message: "Invalid email for applying coupon",
      });
    }

    try {
      const phoneNumber = parsePhoneNumber(mobile, "IN");
      if (!phoneNumber?.isValid()) {
        return NextResponse.json({
          success: false,
          message: "Invalid phone number",
        });
      }
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    let coupon = null;
    if (couponCode) {
      const isCouponUsed = await CouponUsage.findOne({
        code: couponCode,
        email,
        phone: mobile,
      });

      if (isCouponUsed) {
        return NextResponse.json({
          success: false,
          message: "Coupon already used",
        });
      }

      coupon = await Coupon.findOne({
        code: couponCode,
        status: "published",
      });

      if (!coupon) {
        return NextResponse.json({
          success: false,
          message: "Coupon not found",
        });
      }

      const now = new Date();
      if (coupon.startDate > now || coupon.endDate < now) {
        return NextResponse.json({
          success: false,
          message: "Coupon is expired",
        });
      }
    }

    const {
      subTotal,
      tax,
      total,
      discount,
      adminDiscountAmount,
      couponDiscount,
    } = cartCalculation(cart, coupon, adminDiscountPercent);

    if (coupon && coupon.minimumAmount > subTotal) {
      return NextResponse.json({
        success: false,
        message: "Minimum amount not reached for coupon",
      });
    }

    let rp_order = null;
    let paymentDetails = {};

    if (payment.method === "RAZORPAY") {
      const amount = toPaise(total);
      if (!(amount >= MIN_PAISE)) {
        return NextResponse.json({
          success: false,
          message: "The amount is too low for online payment. Please choose cash on delivery",
        });
      }
      try {
        rp_order = await getRazorpay().orders.create({
          amount,
          currency: "INR",
          receipt: `receipt_order_${Date.now()}`,
        });
      } catch (rpError) {
        const { status, message } = razorpayFailure(rpError);
        console.error("Razorpay order failed:", rpError?.error?.description || rpError?.message);
        return NextResponse.json({ success: false, message }, { status });
      }

      paymentDetails = {
        method: "RAZORPAY",
        payment_status: "pending",
        amount: total,
        tax: tax,
        vpa: "",
        rp_order_id: rp_order.id,
        rp_payment_id: "",
        rp_signature: "",
        rp_order_status: rp_order.status,
        rp_receipt: rp_order.receipt,
      };
    } else {
      paymentDetails = {
        method: payment.method,
      };
    }

    let paymentBody = {};
    if (payment.method === "COD") {
      paymentBody = {
        payment_method: "COD",
        payment_status: "pending",
        amount: total,
        tax: tax,
        advanced: payment?.advanced || 0,
        vpa: "",
        rp_payment_id: "",
        rp_order_id: "",
        rp_signature: "",
      };
    } else if (payment.method === "RAZORPAY") {
      paymentBody = {
        payment_method: "RAZORPAY",
        payment_status: "pending",
        amount: total,
        tax: tax,
        advanced: payment?.advanced || 0,
        vpa: "",
        rp_payment_id: "",
        rp_order_id: rp_order.id,
        rp_signature: "",
      };
    }

    const stationRes = await Station.findOne({ code: station.code });
    if (!stationRes) {
      return NextResponse.json({
        success: false,
        message: "Invalid station",
      });
    }
    const order = new Order({
      vendor: vendor._id,
      station: stationRes._id,
      total,
      subTotal,
      tax,
      train: {
        train_number: train?.train_number || user_details?.trainNo || "",
        train_pnr: user_details?.pnr || "",
      },
      couponAmount: couponDiscount,
      adminDiscountPercent,
      adminDiscountValue: adminDiscountAmount,
      totalDiscount: discount,
      user_details,
      payment: paymentBody,
      // links the order to its Razorpay order, so verify-payment can reject a payment made for another order
      rpOrderId: rp_order?.id,
      status: "placed",
      deliveryDateTime: resolveDeliveryDateTime(deliveryDateTime, station),
      orderSource: orderSource || "website",
    });
    await order.save();

    const orderItems = cart.map((item) => ({
      Order_Id: order._id,
      Item_Id: item._id,
      Quantity: item.quantity,
      Price: item.price,
    }));
    await OrderItems.insertMany(orderItems);

    const itemIds = cart.map((item) => item._id);

    const dbItems = await Menu.find({ _id: { $in: itemIds } }).populate(
      "Category_Id",
      "title"
    );

    const populatedItems = dbItems.map((dbItem) => {
      const cartItem = cart.find((c) => c._id === dbItem._id.toString());
      return {
        _id: dbItem._id,
        name: dbItem.Item_Name,
        category: dbItem.Category_Id?.title || "",
        image: dbItem.image,
        price: cartItem?.price || dbItem.Price,
        final_price: dbItem.Final_Price,
        discount: dbItem.Discount,
        quantity: cartItem?.quantity || 1,
        food_type: dbItem.Food_Type,
        description: dbItem.Description,
      };
    });
    await order.populate("station");

    if (coupon) {
      const couponUsage = new CouponUsage({
        code: couponCode,
        email,
        phone: mobile,
      });
      await couponUsage.save();
    }

    // Cash on delivery is final now, so tell the vendor and the customer right away.
    // Online payments are announced once the payment is verified (verify-payment).
    if (payment.method === "COD") await notifyOrderPlaced(order._id);

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      data: {
        vendor: order.vendor,
        station: {
          _id: order.station._id,
          code: order.station.code,
          name: order.station.name,
          address: order.station.address || "",
        },
        train: order.train,
        total: order.total,
        subTotal: order.subTotal,
        tax: order.tax,
        couponAmount: order.couponAmount,
        couponDiscountAmount: order.couponAmount,
        adminDiscountAmount: order.adminDiscountAmount,
        adminDiscountPercent: order.adminDiscountPercent,
        totalDiscount: order.totalDiscount,
        user_details: order.user_details,
        status: order.status,
        deliveryDateTime: order.deliveryDateTime,
        orderSource: order.orderSource,
        _id: order._id,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        order_id: order.order_id,
        items: populatedItems,
        payment: {
          ...paymentDetails,
          advanced: payment?.advanced || 0,
          remainingAmount: Number(
            (order.total - (payment?.advanced || 0)).toFixed(2)
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
