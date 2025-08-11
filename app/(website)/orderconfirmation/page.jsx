"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Typography, Table, Tag } from "antd";
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
    if (data) setOrderData(JSON.parse(data));
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

  const taxValue =
    orderData.payment?.tax ?? Number((orderData.subTotal * 0.05).toFixed(2));
  const taxPercent = orderData.payment?.tax
    ? ((orderData.payment.tax / orderData.subTotal) * 100).toFixed(2)
    : 5;

  const statusColors = {
    placed: "blue",
    delivered: "green",
    pending: "orange",
  };

  const columns = [
    {
      title: "Item",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (qty) => (
        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
          {qty}x
        </span>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `₹${price.toFixed(2)}`,
    },
    {
      title: "Total",
      key: "total",
      align: "right",
      render: (item) => `₹${(item.price * item.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffdf5] p-3 sm:p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow p-4 text-center border border-gray-100">
          <CheckCircleFilled className="text-3xl sm:text-3xl text-[#704d25] animate-bounce" />
          <Title level={3} className="!mb-0 text-[#704D25]">
            {" "}
            Thank you for your order!
          </Title>
          <Text type="secondary" className="text-sm">
            Your meal will be delivered soon.
          </Text>
        </div>

        <Card
          className="rounded-xl border border-yellow-100"
          bodyStyle={{ padding: "14px" }}
        >
          <Title level={5} className="!mb-3">
            Order Summary
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
            <div>
              <Text type="secondary">Order ID</Text>
              <div>{orderData.order_id || "N/A"}</div>
            </div>
            <div>
              <Text type="secondary">Order Date</Text>
              <div>
                {orderData.createdAt
                  ? new Date(orderData.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "N/A"}
              </div>
            </div>
            <div>
              <Text type="secondary">Payment Method</Text>
              <div>{orderData.payment?.method || "N/A"}</div>
            </div>
          </div>
        </Card>

        <Card
          className="rounded-xl border border-yellow-100"
          bodyStyle={{ padding: "14px" }}
        >
          <Title level={5} className="!mb-3">
            Order & Delivery Info
          </Title>

          <div className="mb-4">
            <Text strong className="block mb-1 text-[#704D25]">
              Delivery (Train) Details
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              <div>
                <Text type="secondary">Train No.</Text>
                <div>{orderData.train?.train_number || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary">PNR</Text>
                <div>{orderData.train?.train_pnr || "N/A"}</div>
              </div>
              <div>
                <Text type="secondary">Coach / Seat</Text>
                <div>
                  {orderData.user_details?.coach || "N/A"} /{" "}
                  {orderData.user_details?.seatNo || "N/A"}
                </div>
              </div>
              <div>
                <Text type="secondary">Station</Text>
                <div>
                  {orderData.station?.name} ({orderData.station?.code})
                </div>
              </div>
              <div className="sm:col-span-2">
                <Text type="secondary">Address</Text>
                <div>{orderData.station?.address}</div>
              </div>
            </div>
          </div>

          <hr className="my-3" />

          <div>
            <Text strong className="block mb-1 text-[#704D25]">
              Customer Details
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
              <div>
                <Text type="secondary">Name</Text>
                <div>{orderData.user_details?.name}</div>
              </div>
              <div>
                <Text type="secondary">Mobile</Text>
                <div>{orderData.user_details?.mobile}</div>
              </div>
              <div>
                <Text type="secondary">Alternate Mobile</Text>
                <div>{orderData.user_details?.alternateMobile || "N/A"}</div>
              </div>
              <div className="sm:col-span-2">
                <Text type="secondary">Email</Text>
                <div>{orderData.user_details?.email}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          className="rounded-xl border border-yellow-100"
          bodyStyle={{ padding: "14px" }}
        >
          <Title level={5} className="!mb-2">
            Your Order
          </Title>
          <Table
            columns={columns}
            dataSource={orderData.items || []}
            pagination={false}
            rowKey="_id"
            size="small"
            bordered={false}
          />

          <div className="bg-gray-50 rounded-lg p-3 mt-3 text-sm">
            <div className="flex justify-between mb-1">
              <Text>Subtotal ({orderData.items.length} items)</Text>
              <Text>₹{orderData.subTotal.toFixed(2)}</Text>
            </div>
            {orderData.couponAmount > 0 && (
              <div className="flex justify-between mb-1 text-green-600">
                <span className="flex items-center gap-1">
                  💳 Coupon Discount
                </span>
                <span>-₹{orderData.couponAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-1">
              <Text>Tax ({taxPercent}%)</Text>
              <Text>₹{taxValue.toFixed(2)}</Text>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-base">
              <Text>Total</Text>
              <Text>₹{orderData.total.toFixed(2)}</Text>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Text>Status</Text>
              <Tag color={statusColors[orderData.status] || "orange"}>
                {orderData.status?.toUpperCase()}
              </Tag>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className="flex-1 h-10 font-medium border-none"
            style={{ backgroundColor: "#D49929" }}
          >
            Download Invoice
          </Button>
          <Button
            icon={<HomeOutlined />}
            onClick={() => router.push("/")}
            className="flex-1 h-10 font-medium border-none"
            style={{ backgroundColor: "#704D25", color: "#fff" }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
