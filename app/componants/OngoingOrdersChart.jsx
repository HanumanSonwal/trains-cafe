"use client";
import React from "react";
import { Card, Table } from "antd";
import dayjs from "dayjs";

const OngoingOrdersChart = ({ pendingOrders = [] }) => {
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span
          style={{
            color:
              text === "placed"
                ? "#d48806"
                : text === "delivered"
                ? "green"
                : text === "cancelled"
                ? "red"
                : "#555",
            fontWeight: 600,
          }}
        >
          {text?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (vendor) => vendor?.Vendor_Name || "—",
    },
    {
      title: "Station",
      dataIndex: "station",
      key: "station",
      render: (station) => station?.name || "—",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD MMM YYYY, hh:mm A"),
    },
    {
      title: "Expected Delivery",
      dataIndex: "deliveryDateTime",
      key: "deliveryDateTime",
      render: (date) =>
        date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "—",
    },
    {
      title: "Amount (₹)",
      dataIndex: "total",
      key: "total",
    },
  ];

  const dataSource = pendingOrders.map((order, index) => ({
    key: order._id || index,
    order_id: order.order_id,
    status: order.status,
    vendor: order.vendor,
    station: order.station,
    createdAt: order.createdAt,
    deliveryDateTime: order.deliveryDateTime,
    total: order.total,
  }));

  return (
    <Card
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="bg-[#FAF3CC] border-2 border-b-4"
      title={
        <div style={{ borderBottom: "4px solid #D6872A", paddingBottom: "4px" }}>
          Ongoing Orders
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: true }}
      />
    </Card>
  );
};

export default OngoingOrdersChart;
