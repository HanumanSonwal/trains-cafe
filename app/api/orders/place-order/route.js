import { cartCalculation } from "@/app/lib";
import Order from "@/app/models/order";
import OrderItems from "@/app/models/orderItems";
import Station from "@/app/models/station";
import CouponUsage from "@/app/models/couponUsage";
import Coupon from "@/app/models/coupon";
import { NextResponse } from "next/server";
import { parsePhoneNumber } from "libphonenumber-js";
import * as EmailValidator from "email-validator";
import Razorpay from "razorpay";
import Menu from "@/app/models/menu";
import Category from "@/app/models/category";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const {
      vendor,
      station,
      cacategory,
      train,
      payment,
      cart,
      user_details,
      couponCode,
      adminDiscountPercent = 0,
      deliveryDateTime,
      orderSource,
    } = await req.json();

    if (!vendor || !station || !train || !payment) {
      return NextResponse.json({
        success: false,
        message: "Invalid request. Required fields missing.",
      });
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

    console.log(subTotal, "subTotal---");
    console.log(tax, "tax---");
    console.log(discount, "discount---");
    console.log(adminDiscountAmount, "adminDiscountAmount---");
    console.log(couponDiscount, "couponDiscount---");
    console.log(total, "total---");

    if (coupon && coupon.minimumAmount > subTotal) {
      return NextResponse.json({
        success: false,
        message: "Minimum amount not reached for coupon",
      });
    }

    let rp_order = null;
    let paymentDetails = {};

    if (payment.method === "RAZORPAY") {
      rp_order = await razorpay.orders.create({
        amount: Math.round(total * 100),
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });

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
      status: "placed",
      deliveryDateTime: deliveryDateTime
        ? new Date(deliveryDateTime)
        : new Date(),
      orderSource: orderSource || "website",
    });
    console.log("Order before save:", JSON.stringify(order, null, 2));
    await order.save();

    const orderItems = cart.map((item) => ({
      Order_Id: order._id,
      Item_Id: item._id,
      Quantity: item.quantity,
      Price: item.price,
    }));
    await OrderItems.insertMany(orderItems);

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
