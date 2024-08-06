// components/DeliveredVsCancelChart.js
"use client";
import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Delivered', value: 800 },
  { name: 'Cancelled', value: 200 },
];

const DeliveredVsCancelChart = () => (
  <Card title="Delivered vs Cancel">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default DeliveredVsCancelChart;
