"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Typography, Divider } from "antd";
import {
  CheckCircleFilled,
  DownloadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { generateInvoiceTemplate } from "@/templates/generateInvoiceTemplate";

const { Title, Text } = Typography;

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("orderData");
    if (data) {
      setOrderData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  const handleDownload = () => {
    const htmlContent = generateInvoiceTemplate(orderData);

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderData?._id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spin size="large" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg bg-white">
        No order data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <Card
          className="shadow-md overflow-hidden rounded-lg"
          bordered={false}
          style={{ backgroundColor: "#fff" }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <CheckCircleFilled
              className="text-4xl text-[#4caf50] animate-bounce mb-3"
              aria-label="Order success icon"
            />
            <Title level={2} className="!mb-0 !text-2xl sm:!text-3xl font-semibold">
              Thank you for your order!
            </Title>
            <Text type="secondary" className="block mt-1">
              Your delicious meal will be delivered on the train soon.
            </Text>
          </div>

          {/* Order Details */}
          <Card
            className="mb-6"
            bordered={false}
            style={{ backgroundColor: "#f0f5ff", borderRadius: 8 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Text type="secondary" className="text-sm">
                  Date of Order
                </Text>
                <div className="font-medium text-base">
                  {new Date(orderData.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Order ID
                </Text>
                <div className="font-medium text-base break-all">{orderData.order_id}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Payment Method
                </Text>
                <div className="font-medium text-base">
                  {orderData.payment?.payment_method || "N/A"}
                </div>
              </div>
            </div>
          </Card>

          {/* Train Details */}
          <Card
            className="mb-6"
            bordered={false}
            style={{ backgroundColor: "#fff", borderRadius: 8 }}
          >
            <Title level={4} className="mb-4 font-semibold">
              Train Details
            </Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Text type="secondary" className="text-sm">
                  Train Number
                </Text>
                <div className="font-medium text-base">{orderData.train?.train_number || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Train PNR
                </Text>
                <div className="font-medium text-base">{orderData.train?.train_pnr || "N/A"}</div>
              </div>
            </div>
          </Card>

          {/* User Details */}
          <Card
            className="mb-6"
            bordered={false}
            style={{ backgroundColor: "#f0f5ff", borderRadius: 8 }}
          >
            <Title level={4} className="mb-4 font-semibold">
              User Details
            </Title>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <Text type="secondary" className="text-sm">
                  Name
                </Text>
                <div className="font-medium text-base">{orderData.user_details?.name || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Email
                </Text>
                <div className="font-medium text-base break-all">{orderData.user_details?.email || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Mobile
                </Text>
                <div className="font-medium text-base">{orderData.user_details?.mobile || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  PNR No.
                </Text>
                <div className="font-medium text-base">{orderData.user_details?.pnr || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Coach
                </Text>
                <div className="font-medium text-base">{orderData.user_details?.coach || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary" className="text-sm">
                  Seat No
                </Text>
                <div className="font-medium text-base">{orderData.user_details?.seatNo || "N/A"}</div>
              </div>
            </div>
          </Card>

          {/* Special Instructions */}
          {orderData.user_details?.instructions && (
            <Card
              className="mb-6"
              bordered={false}
              style={{ backgroundColor: "#fff", borderRadius: 8 }}
            >
              <Title level={4} className="mb-4 font-semibold">
                Special Instructions
              </Title>
              <Text>{orderData.user_details.instructions}</Text>
            </Card>
          )}

          {/* Order Status */}
          <Card
            className="mb-6"
            bordered={false}
            style={{ backgroundColor: "#f0f5ff", borderRadius: 8 }}
          >
            <Title level={4} className="mb-4 font-semibold">
              Order Status
            </Title>
            <Text
              className="text-base font-medium capitalize"
              style={{
                color:
                  orderData.status === "placed"
                    ? "#1890ff"
                    : orderData.status === "delivered"
                    ? "#52c41a"
                    : "#faad14",
              }}
            >
              {orderData.status || "N/A"}
            </Text>
          </Card>

          {/* Payment Summary */}
          <Card
            className="mb-6"
            bordered={false}
            style={{ backgroundColor: "#fff", borderRadius: 8 }}
          >
            <Title level={4} className="mb-4 font-semibold">
              Payment Summary
            </Title>
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <Text>Subtotal</Text>
                <Text>₹{Number(orderData.subTotal).toFixed(2)}</Text>
              </div>
              {orderData.couponAmount > 0 && (
                <div className="flex justify-between text-base text-green-600">
                  <Text>Coupon Discount</Text>
                  <Text>-₹{Number(orderData.couponAmount).toFixed(2)}</Text>
                </div>
              )}
              <div className="flex justify-between text-base">
                <Text>Tax</Text>
                <Text>₹{Number(orderData.payment.tax).toFixed(2)}</Text>
              </div>
              <Divider className="my-3" />
              <div className="flex justify-between text-base font-semibold">
                <Text>Total</Text>
                <Text>₹{Number(orderData.total).toFixed(2)}</Text>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="flex-1 text-base font-semibold"
            >
              Download Invoice
            </Button>

            <Button
              icon={<HomeOutlined />}
              onClick={() => router.push("/")}
              className="flex-1 text-base font-semibold"
              type="default"
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
