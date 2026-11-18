"use client";
import React, { useState } from "react";
import { Button, message, Divider, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/services/orders";
import { resetCart } from "@/app/redux/cartSlice";
import RecentOrders from "@/app/componants/RecentOrders";
import Image from "next/image";
import ItemTable from "./ItemTable";
import TotalSection from "./TotalSection";
import CouponSection from "./CouponSection";
import OrderDetailsForm from "./OrderDetailsForm";
import PaymentMethod from "./PaymentMethod";

// Online payment is offered only when a Razorpay key id is configured (the secret never reaches the browser).
const ONLINE_PAYMENT = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

const CheckoutPage = () => {
  const { items, vendor, train, station } = useSelector((state) => state.cart);
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const mobile = Form.useWatch("mobile", form);
  const [paymentMethod, setPaymentMethod] = useState(ONLINE_PAYMENT ? "RAZORPAY" : "COD");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const leadIdRef = React.useRef(null);

  const createLead = async (mobile) => {
    if (leadIdRef.current || !mobile || mobile.length !== 10) return;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();
      leadIdRef.current = data?.leadId || data?.data?._id || null;

      if (leadIdRef.current) console.log("✅ Lead Created:", leadIdRef.current);
    } catch {}
  };

  const updateLead = async (values) => {
    const leadId = leadIdRef.current;
    if (!leadId) return;

    const hasValue = Object.values(values).some(
      (v) => v && v.toString().trim() !== ""
    );
    if (!hasValue) return;

    const payload = {
      name: values.name || "",
      mobile: values.mobile || "",
      email: values.email || "",
      station: station?.name || "",
      train_number: values.trainNo || train?.train_number || "",
      pnr: values.pnr || "",
      cartItems: items,
    };

    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🔄 Lead Updated");
    } catch {}
  };

  const deleteLead = async () => {
    const leadId = leadIdRef.current;
    if (!leadId) return;

    try {
      await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
      console.log("🗑 Lead Deleted");
    } catch {}

    leadIdRef.current = null;
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const totalAmount = items.reduce(
    (acc, item) => acc + (item.Final_Price ?? item.price) * item.quantity,
    0
  );

  const discountedAmount = totalAmount - discount;
  const gstAmount = discountedAmount * 0.05;
  const payableAmount = discountedAmount + gstAmount;

  const createOrderPayload = (values) => ({
    vendor,
    station,
    train: {
      train_number: train?.train_number || values.trainNo || "",
      train_pnr: values.pnr || "",
    },
    payment: {
      method: paymentMethod === "RAZORPAY" ? "RAZORPAY" : "COD",
      advanced: values.advancedPayment || 0,
    },
    cart: items.map(({ _id, quantity, Final_Price, price }) => ({
      _id,
      quantity,
      price: Final_Price ?? price,
    })),

    user_details: { ...values },
    couponCode: couponCode || "",
    adminDiscountPercent: 0,
  });

  const handleCODFlow = (order) => {
    localStorage.setItem("orderData", JSON.stringify(order));
    dispatch(resetCart());
    message.success("Order placed successfully!");
    form.resetFields();
    setCouponCode("");
    setDiscount(0);
    setLoading(false);
    router.push("/order-confirmation");
  };

  const handleRazorpayFlow = (order, values) => {
    setLoading(false);
    setPaymentProcessing(true);

    // The amount to charge is the one the server calculated for this order, not the browser's own sum.
    const amountPaise = Math.round(Number(order.payment?.amount ?? payableAmount) * 100);
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId || typeof window.Razorpay !== "function") {
      message.error("Online payment is not available right now. Please choose cash on delivery.");
      setPaymentProcessing(false);
      return;
    }

    const razorpayOptions = {
      key: keyId,
      amount: amountPaise,
      currency: "INR",
      name: "Trains Cafe",
      description: "Train Food Order",
      order_id: order.payment.rp_order_id,
      handler: async (response) => {
        try {
          const verifyRes = await fetch("/api/orders/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderId: order._id }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            localStorage.setItem("orderData", JSON.stringify(order));
            dispatch(resetCart());
            router.push("/order-confirmation");
          } else message.error(verifyData.message || "Payment verification failed.");
        } catch {
          message.error("Payment verification failed.");
        } finally {
          setPaymentProcessing(false);
        }
      },
      modal: { ondismiss: () => setPaymentProcessing(false) },
      prefill: {
        name: values.name,
        email: values.email,
        contact: values.mobile,
      },
      notes: { order_id: order._id },
      theme: { color: "#D49929" },
    };

    const rzp = new window.Razorpay(razorpayOptions);
    // The bank declined or the payment broke: tell the customer and let them try again.
    rzp.on("payment.failed", (response) => {
      message.error(response?.error?.description || "Payment failed. Please try again.");
      setPaymentProcessing(false);
    });
    rzp.open();
  };

  const handlePlaceOrder = async (values) => {
    if (!paymentMethod) {
      message.error("Please select a payment method before placing the order.");
      return;
    }

    try {
      setLoading(true);

      await updateLead(values);

      const payload = createOrderPayload(values);

      const response = await placeOrder(
        payload.vendor,
        payload.station,
        payload.train,
        payload.payment,
        payload.cart,
        payload.user_details,
        payload.couponCode
      );

      if (response?.success && response?.data?._id) {
        const order = response.data;

        await deleteLead();

        if (paymentMethod === "RAZORPAY") {
          handleRazorpayFlow(order, values);
        } else {
          handleCODFlow(order);
        }

        return;
      }

      message.error(
        response?.message ||
          response?.error ||
          "Something went wrong, order not completed."
      );

      await updateLead(values);
    } catch (error) {
      console.error("Order Error:", error);
      message.error("Something went wrong. Please try again.");

      await updateLead(values);
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto bg-gray-100 min-h-screen">
        <div className="relative h-40 md:h-60 mb-4">
          <img
            src="/images/checkoutbanner.png"
            alt="food delivery in train"
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>

        <div className="p-4">
          <h1 className="text-xl font-bold mb-2 text-center text-gray-800">
            Your Order at{" "}
            <span style={{ color: "#704d25" }}>{station.name}</span> from{" "}
            <span style={{ color: "#704d25" }}>Trains Cafe</span>
          </h1>

          <Form layout="vertical" form={form} onFinish={handlePlaceOrder}>
            <OrderDetailsForm
              form={form}
              createLead={createLead}
              updateLead={updateLead}
            />

            <div className="bg-white shadow rounded-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <ItemTable items={items} />
              <Divider className="!my-4" />
              <TotalSection
                {...{
                  totalAmount,
                  gstAmount,
                  discount,
                  payableAmount,
                  isOpen,
                  setIsOpen,
                }}
                totalItem={items.length}
              />
            </div>

            <CouponSection
              {...{ email, mobile, items, couponCode }}
              onCouponCodeChange={setCouponCode}
              onDiscountChange={setDiscount}
            />

            <PaymentMethod
              value={paymentMethod}
              onChange={setPaymentMethod}
              onlineAvailable={ONLINE_PAYMENT}
            />

            <Button
              type="primary"
              className="mt-6 order-btn"
              htmlType="submit"
              loading={loading || paymentProcessing}
            >
              {paymentMethod === "RAZORPAY" ? `Pay ₹${payableAmount.toFixed(2)} & Place Order` : "Place Order"}
            </Button>
          </Form>

          <div className="mt-6">
            <RecentOrders />
          </div>
        </div>
      </div>

      {paymentProcessing && (
        <div className="fixed inset-0 bg-white/70 z-[9999] flex justify-center items-center">
          <div className="loader"></div>
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
