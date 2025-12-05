"use client";
import React from "react";
import { Card, Table, Button, Tooltip, Tag } from "antd";
import { PhoneOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const OngoingOrdersChart = ({ pendingOrders = [] }) => {
  const router = useRouter();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (id) => <span style={{ color: "#D6872A", fontWeight: 600 }}>#{id}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) => {
        const colorMap = {
          placed: "orange",
          preparing: "blue",
          delivered: "green",
          cancelled: "red",
        };
        return <Tag color={colorMap[text] || "default"}>{text.toUpperCase()}</Tag>;
      },
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
      title: "Customer",
      key: "user_details",
      dataIndex: "user_details",
      render: (user) => (
        <div>
          <div style={{ fontWeight: 600 }}>{user?.name || "—"}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>{user?.mobile}</div>
        </div>
      ),
    },
    {
      title: "Order Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (date) => dayjs(date).format("DD MMM, hh:mm A"),
    },
    {
      title: "Delivery ETA",
      dataIndex: "deliveryDateTime",
      key: "deliveryDateTime",
      width: 170,
      render: (date) =>
        date ? dayjs(date).format("DD MMM, hh:mm A") : <span style={{ color: "#888" }}>—</span>,
    },
    {
      title: "Amount",
      dataIndex: "total",
      key: "total",
      width: 110,
      render: (value) => (
        <b style={{ color: "#333" }}>₹{parseFloat(value).toFixed(2)}</b>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Tooltip title="Call Customer">
            <Button
              size="small"
              type="text"
              icon={<PhoneOutlined />}
              style={{ color: "#D6872A" }}
              onClick={() =>
                (window.location.href = `tel:${record.user_details?.mobile}`)
              }
            />
          </Tooltip>

          <Tooltip title="View Order">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined />}
              style={{ color: "#D6872A" }}
              onClick={() => router.push(`/admin/orders`)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const dataSource = pendingOrders.map((order) => ({
    key: order._id,
    order_id: order.order_id,
    status: order.status,
    vendor: order.vendor,
    station: order.station,
    user_details: order.user_details,
    createdAt: order.createdAt,
    deliveryDateTime: order.deliveryDateTime,
    total: order.total,
  }));

  return (
    <Card
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "12px",
        border: "1px solid #f0e2b6",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
      }}
      title={
        <div
    style={{
            borderBottom: "4px solid #D6872A",
            paddingBottom: "6px",
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          Ongoing Orders
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
        }}
        rowClassName="custom-row"
        style={{ borderRadius: "10px" }}
      />
    </Card>
  );
};

export default OngoingOrdersChart;
