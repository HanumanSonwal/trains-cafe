"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, message, Radio, Row, Col, Divider, Form } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/services/orders";
import { resetCart } from "@/app/redux/cartSlice";
import RecentOrders from "@/app/componants/RecentOrders";
import Image from "next/image";
import Script from "next/script";
import ItemTable from "./ItemTable";
import TotalSection from "./TotalSection";
import CouponSection from "./CouponSection";

const CheckoutPage = () => {
  const { items, vendor, train, station } = useSelector((state) => state.cart);
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const mobile = Form.useWatch("mobile", form);
  const [paymentMethod, setPaymentMethod] = useState("PAYTM");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handlePlaceOrder = async (values) => {
    try {
      const methodToSend = paymentMethod === "RAZORPAY" ? "RAZORPAY" : "COD";
      const payment = { method: methodToSend };

      const response = await placeOrder(
        vendor,
        station,
        train,
        payment,
        items,
        values,
        couponCode,
        discount
      );

      const order = response.data;
      if (paymentMethod === "RAZORPAY") {
        if (!window.Razorpay) {
          message.error("Payment system not ready. Please try again.");
          return;
        }
        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: order.total * 100,
          currency: "INR",
          name: "Trains Cafe",
          description: "Train Food Order",
          order_id: order.payment.rp_order_id,

          handler: async function (response) {
            const verifyRes = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              localStorage.setItem("orderData", JSON.stringify(order));
              dispatch(resetCart());
              router.push("/orderconfirmation");
            } else {
              message.error("Payment verification failed.");
            }
          },
          prefill: {
            name: values.name,
            email: values.email,
            contact: values.mobile,
          },
          notes: {
            order_id: order._id,
          },
          theme: {
            color: "#D49929",
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
        return;
      }

      localStorage.setItem("orderData", JSON.stringify(order));
      dispatch(resetCart());
      message.success("Order placed successfully!");
      form.resetFields();
      setIsCouponApplied(false);
      router.push("/orderconfirmation");
    } catch (error) {
      message.error("Error placing order. Please try again.");
      console.error("Order Error:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const gstAmount = totalAmount * 0.05;
  const WithGstAmount = totalAmount + gstAmount;
  const payableAmount = WithGstAmount - discount;

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

          <div className="flex justify-center mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Delivered to 10,000+ Train Passengers
            </span>
          </div>

          <p className="text-center text-gray-600 text-sm max-w-md mx-auto mb-6">
            We deliver hot & hygienic food right to your train seat. Please
            verify your travel and contact details carefully before placing the
            order.
          </p>

          <Form layout="vertical" form={form} onFinish={handlePlaceOrder}>
            <div className="bg-white shadow rounded-lg p-2 sm:p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Customer Order Details
              </h2>

              <Divider orientation="left">User Details</Divider>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="mobile"
                    label="Mobile Number"
                    style={{ marginBottom: 12 }}
                    rules={[
                      { required: true, message: "Mobile number is required" },
                      {
                        pattern: /^\d{10}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    ]}
                  >
                    <Input placeholder="Mobile Number" maxLength={10} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Name"
                    style={{ marginBottom: 12 }}
                    rules={[
                      { required: true, message: "Name is required" },
                      {
                        pattern: /^[A-Za-z\s]+$/,
                        message: "Name should contain only letters",
                      },
                    ]}
                  >
                    <Input placeholder="Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    style={{ marginBottom: 12 }}
                    rules={[
                      { required: true, message: "Email is required" },
                      { type: "email", message: "Enter a valid email address" },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="alternateMobile"
                    label="Alternate Mobile (Optional)"
                    style={{ marginBottom: 12 }}
                    rules={[
                      {
                        pattern: /^\d{10}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    ]}
                  >
                    <Input placeholder="Alternate Mobile" maxLength={10} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">Train Details</Divider>
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="pnr"
                    label="PNR"
                    style={{ marginBottom: 12 }}
                    rules={[
                      { required: true, message: "PNR is required" },
                      {
                        pattern: /^\d{10}$/,
                        message: "PNR must be exactly 10 digits",
                      },
                    ]}
                  >
                    <Input placeholder="Enter 10 Digit PNR" maxLength={10} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="trainNo"
                    label="Train Number"
                    style={{ marginBottom: 12 }}
                    rules={[
                      { required: true, message: "Train number is required" },
                      {
                        pattern: /^\d+$/,
                        message: "Train number should contain only digits",
                      },
                    ]}
                  >
                    <Input placeholder="Train Number" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="coach"
                    label="Coach"
                    style={{ marginBottom: 12 }}
                  >
                    <Input placeholder="Coach" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="seatNo"
                    label="Seat No."
                    style={{ marginBottom: 12 }}
                  >
                    <Input placeholder="Seat No." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="instructions"
                    label="Optional Instructions"
                    style={{ marginBottom: 0 }}
                  >
                    <Input.TextArea
                      placeholder="Optional Instructions"
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="bg-white shadow rounded-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Order Details
              </h2>
              <ItemTable items={items} />
              <Divider className="!my-4" />
              <TotalSection
                totalAmount={totalAmount}
                gstAmount={gstAmount}
                discount={discount}
                payableAmount={payableAmount}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </div>

            <CouponSection
              email={email}
              mobile={mobile}
              items={items}
              onDiscountChange={(disc) => setDiscount(disc)}
            />

            <div className="bg-white shadow rounded-lg p-4 mt-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Payment Options
              </h2>

              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="flex flex-col justify-around md:flex-row gap-4"
              >
                <Radio.Button
                  value="RAZORPAY"
                  className={`rounded !p-0 !bg-white flex items-center justify-center w-[130px] ${
                    paymentMethod === "RAZORPAY"
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
                    src="/images/paymentMethod/img1.svg"
                    alt="Razorpay"
                    width={120}
                    height={30}
                    className="object-contain"
                  />
                </Radio.Button>

                <Radio.Button
                  value="COD"
                  className={`rounded !p-0 !bg-white flex items-center justify-center w-[130px] ${
                    paymentMethod === "COD"
                      ? "!border-[2px] !border-[#D49929]"
                      : "!border !border-gray-200"
                  }`}
                  style={{ boxShadow: "none", height: "55px" }}
                >
                  <Image
                    src="/images/paymentMethod/img2.svg"
                    alt="COD"
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </Radio.Button>
              </Radio.Group>
            </div>

            <Button type="primary" className="mt-6 order-btn" htmlType="submit">
              Place Order
            </Button>
          </Form>

          <div className="mt-6">
            <RecentOrders />
          </div>
        </div>
      </div>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
    </>
  );
};

export default CheckoutPage;
