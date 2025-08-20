"use client";
import React, { useState } from "react";
import { Button, message, Radio, Divider, Form } from "antd";
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

const CheckoutPage = () => {
  const { items, vendor, train, station } = useSelector((state) => state.cart);
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const mobile = Form.useWatch("mobile", form);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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
    router.push("/orderconfirmation");
  };

  const handleRazorpayFlow = (order, values) => {
    setLoading(false);
    setPaymentProcessing(true);

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      amount: payableAmount * 100,
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
            router.push("/orderconfirmation");
          } else message.error("Payment verification failed.");
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

    new window.Razorpay(razorpayOptions).open();
  };

  const handlePlaceOrder = async (values) => {
    if (!paymentMethod) {
      message.error("Please select a payment method before placing the order.");
      return;
    }

    try {
      setLoading(true);
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
      if (response?.success) {
        const order = response?.data;
        if (!order?._id) {
          message.error("Invalid order response.");
          setLoading(false);
          return;
        }

        paymentMethod === "RAZORPAY"
          ? handleRazorpayFlow(order, values)
          : handleCODFlow(order);
      } else {
        message.error(
          response?.message || response?.error || "Something went wrong."
        );
        setLoading(false);
      }
    } catch (error) {
      message.error(error?.message || "Error placing order. Please try again.");
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
            <OrderDetailsForm />

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

            {/* <div className="bg-white shadow rounded-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-4">Payment Options</h2>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex flex-col md:flex-row gap-4"
              >
                {["RAZORPAY", "COD"].map((method) => (
                  <Radio.Button
                    key={method}
                    value={method}
                    className={`rounded !p-0 !bg-white flex items-center justify-center w-[130px] ${
                      paymentMethod === method
                        ? "!border-[2px] !border-[#D49929]"
                        : "!border !border-gray-200"
                    }`}
                    style={{
                      boxShadow: "none",
                      height: "55px",
                      marginRight: "20px",
                    }}
                  >
                    <Image
                      src={`/images/paymentMethod/${
                        method === "RAZORPAY" ? "img1.svg" : "img2.svg"
                      }`}
                      alt={method}
                      width={120}
                      height={method === "RAZORPAY" ? 30 : 40}
                      className="object-contain"
                    />
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div> */}

            <Button
              type="primary"
              className="mt-6 order-btn"
              htmlType="submit"
              loading={loading || paymentProcessing}
            >
              Place Order
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
