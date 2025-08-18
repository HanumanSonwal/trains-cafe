"use client"
import React from 'react';
import { Card } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', behavior: 4000, orderPattern: 2400 },
  { name: 'Feb', behavior: 3000, orderPattern: 1398 },
  { name: 'Mar', behavior: 2000, orderPattern: 9800 },
  { name: 'Apr', behavior: 2780, orderPattern: 3908 },
  { name: 'May', behavior: 1890, orderPattern: 4800 },
  { name: 'Jun', behavior: 2390, orderPattern: 3800 },
  { name: 'Jul', behavior: 3490, orderPattern: 4300 },
];

const COLORS = {
  behavior: '#D6872A',
  orderPattern: '#6F4D27' 
};

const CustomerInsightsChart = () => (
  <Card
    className='bg-[#FAF3CC] border-2 border-b-4'
    title={<div style={{ borderBottom: '4px solid #D6872A', paddingBottom: '4px' }}>Customer Insights</div>}
  >
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="behavior" stroke={COLORS.behavior} fill={COLORS.behavior} />
        <Area type="monotone" dataKey="orderPattern" stroke={COLORS.orderPattern} fill={COLORS.orderPattern} />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export default CustomerInsightsChart;

