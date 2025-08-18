"use client";
import React from "react";
import { Card, Table } from "antd";

const columns = [
  {
    title: "Vendor",
    dataIndex: "vendor",
    key: "vendor",
  },
  {
    title: "Order Accuracy",
    dataIndex: "accuracy",
    key: "accuracy",
  },
  {
    title: "Delivery Time",
    dataIndex: "deliveryTime",
    key: "deliveryTime",
  },
  {
    title: "User Rating",
    dataIndex: "rating",
    key: "rating",
  },
];

const data = [
  {
    key: "1",
    vendor: "Vendor A",
    accuracy: "95%",
    deliveryTime: "2 days",
    rating: "4.5",
  },
];

const VendorPerformanceChart = () => (
  <Card
    style={{
      backgroundColor: "#FAF3CC",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    }}
    title={
      <div style={{ borderBottom: "4px solid #D6872A", paddingBottom: "4px" }}>
        Vendor Performance
      </div>
    }
  >
    <Table columns={columns} dataSource={data} pagination={false} />
  </Card>
);

export default VendorPerformanceChart;
