"use client";
import React from "react";
import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = "#D6872A";

const SalesAnalyticsChart = ({ monthlySales = [] }) => {
  const chartData = monthlySales.map((item) => ({
    name: item.month,
    revenue: parseFloat(item.totalSales) || 0,
    orders: item.totalOrders || 0,
  }));

  return (
    <Card
      className="bg-[#FAF3CC] border-2 border-b-4"
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      title={
        <div
          style={{
            borderBottom: "4px solid #D6872A",
            paddingBottom: "4px",
            fontWeight: 600,
          }}
        >
          Sales Analytics
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={COLORS}
            strokeWidth={3}
            name="Total Sales (₹)"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#8884d8"
            strokeWidth={2}
            name="Total Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesAnalyticsChart;
