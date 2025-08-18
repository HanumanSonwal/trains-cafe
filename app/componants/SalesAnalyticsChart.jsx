// components/SalesAnalyticsChart.js
"use client";
import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const COLORS = '#D6872A'; 

const SalesAnalyticsChart = () => (
  <Card
    className='bg-[#FAF3CC] border-2 border-b-4'
    title={<div style={{ borderBottom: '4px solid #D6872A', paddingBottom: '4px' }}>Sales Analytics</div>}
  >
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke={COLORS} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

export default SalesAnalyticsChart;

