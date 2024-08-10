// components/CODvsOnlineOrderChart.js
"use client"
import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'COD', value: 400 },
  { name: 'Online', value: 600 },
];

const COLORS = ['#D6872A', '#6F4D27'];

const CODonlineChart = () => (
  <Card
    className='bg-[#FAF3CC] border-2 border-b-4'
    title={<div style={{ borderBottom: '4px solid #D6872A', paddingBottom: '4px' }}>COD vs Online Order</div>}
  >
    <ResponsiveContainer width="100%" height={220}>
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

