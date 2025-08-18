"use client";
import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Delivered', value: 800 },
  { name: 'Cancelled', value: 200 },
];

const COLORS = ['#D6872A', '#6F4D27']; 

const DeliveredVsCancelChart = () => (
  <Card className='bg-[#FAF3CC] border-2 border-b-4' title={<div style={{ borderBottom: '4px solid #D6872A', paddingBottom: '4px' }}>Delivered vs Cancel</div>}>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={COLORS[0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

export default DeliveredVsCancelChart;
