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
  Label,
} from "recharts";

const COLORS = "#D6872A";

const SalesAnalyticsChart = ({ monthlySales = [] }) => {
  const chartData = monthlySales.map((item) => ({
    name: item.month,
    revenue: parseFloat(item.totalSales) || 0,
    orders: item.totalOrders || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const revenue = payload.find((p) => p.dataKey === "revenue");
      const orders = payload.find((p) => p.dataKey === "orders");
      return (
        <div
          style={{
            backgroundColor: "#fffbe6",
            border: "1px solid #D6872A",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ fontSize: 14 }}>{label}</strong>
          <div style={{ color: "#D6872A" }}>
            💰 Total Sales:{" "}
            <b>
              ₹
              {(revenue?.value || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </b>
          </div>
          <div style={{ color: "#8884d8" }}>
            🛒 Total Orders: <b>{orders?.value || 0}</b>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className="bg-[#FAF3CC] border-2 border-b-4"
      style={{
        backgroundColor: "#FAF3CC",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
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
          Sales Analytics (Monthly Overview)
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontWeight: 500 }} />
          <YAxis
            yAxisId="left"
            tickFormatter={(value) => `₹${value / 1000}k`}
            label={{
              value: "Sales (₹)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => value}
            label={{
              value: "Orders",
              angle: -90,
              position: "insideRight",
              offset: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke={COLORS}
            strokeWidth={3}
            activeDot={{ r: 6 }}
            dot={{ r: 4 }}
            name="Total Sales (₹)"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 5 }}
            dot={{ r: 3 }}
            name="Total Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesAnalyticsChart;
