// components/CODvsOnlineOrderChart.js
"use client"
import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'COD', value: 400 },
  { name: 'Online', value: 600 },
];

const COLORS = ['#0088FE', '#00C49F'];

const CODonlineChart = () => (
  <Card title="COD vs Online Order">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

export default CODonlineChart;
