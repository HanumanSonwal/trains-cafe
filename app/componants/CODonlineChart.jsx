"use client";
import React from "react";
import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

const COLORS = ["#D6872A", "#6F4D27"];

const CODonlineChart = ({ paymentStats }) => {
  if (!paymentStats) return null;

  const data = [
    {
      name: "COD",
      value: paymentStats.cod || 0,
      amount: paymentStats.codAmount || 0,
      percentage: Number(paymentStats.codPercentage) || 0,
    },
    {
      name: "Online",
      value: paymentStats.online || 0,
      amount: paymentStats.onlineAmount || 0,
      percentage: Number(paymentStats.onlinePercentage) || 0,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fffbe6",
            border: "1px solid #D6872A",
            borderRadius: "8px",
            padding: "10px 12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            lineHeight: "1.5",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600, color: "#333" }}>
            {d.name} Orders
          </p>
          <p style={{ margin: 0, color: "#333" }}>
            🧾 Orders: <b>{d.value}</b>
          </p>
          <p style={{ margin: 0, color: "#333" }}>
            💰 Amount: <b>₹{d.amount.toFixed(2)}</b>
          </p>
          <p style={{ margin: 0, color: "#333" }}>
            📊 Percentage: <b>{d.percentage.toFixed(1)}%</b>
          </p>
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
        boxShadow: "0 3px 12px rgba(0, 0, 0, 0.15)",
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
          COD vs Online Orders
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}

            <Label
              value=""
              position="center"
              style={{ fill: "#333", fontSize: "14px", fontWeight: 600 }}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: "#333", fontWeight: 500 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div
        className="text-center mt-3"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          fontWeight: 500,
          fontSize: "0.95rem",
        }}
      >
        <div>
          🟠 <b>COD:</b> {paymentStats.cod} Orders | ₹
          {paymentStats.codAmount.toFixed(2)} ({paymentStats.codPercentage}%)
        </div>
        <div>
          🟤 <b>Online:</b> {paymentStats.online} Orders | ₹
          {paymentStats.onlineAmount.toFixed(2)} (
          {paymentStats.onlinePercentage}%)
        </div>
      </div>
    </Card>
  );
};

export default CODonlineChart;
