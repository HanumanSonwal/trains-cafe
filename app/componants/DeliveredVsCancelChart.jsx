"use client";
import React from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const DeliveredVsCancelChart = ({ orderStatusStats }) => {
  if (!orderStatusStats) return null;

  const data = [
    {
      name: "Delivered",
      value: orderStatusStats.delivered || 0,
      percentage: Number(orderStatusStats.deliveredPercentage) || 0,
      fill: "#D6872A",
    },
    {
      name: "Cancelled",
      value: orderStatusStats.cancel || 0,
      percentage: Number(orderStatusStats.cancelPercentage) || 0,
      fill: "#6F4D27",
    },
  ];

  return (
    <Card
      style={{
        borderRadius: "12px",
        background: "#FAF3CC",
        boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
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
          Delivered vs Cancel
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" width={100} />

          <Tooltip
            contentStyle={{
              backgroundColor: "#fffbe6",
              border: "1px solid #D6872A",
              borderRadius: "8px",
              padding: "10px 12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              lineHeight: "1.5",
            }}
            formatter={(value, name, entry) => [
              `${value} Orders`,
              entry?.payload?.name,
            ]}
          />

          <Bar dataKey="value" radius={[6, 6, 6, 6]}>
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={(val) => `${val}%`}
              style={{ fontWeight: 600, fill: "#444" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm font-medium">
        <span style={{ color: "#D6872A", fontWeight: 600 }}>
          🟠 Delivered: {orderStatusStats.delivered} (
          {orderStatusStats.deliveredPercentage}%)
        </span>

        <span className="mx-3">•</span>

        <span style={{ color: "#6F4D27", fontWeight: 600 }}>
          🟤 Cancelled: {orderStatusStats.cancel} (
          {orderStatusStats.cancelPercentage}%)
        </span>
      </div>
    </Card>
  );
};

export default DeliveredVsCancelChart;
