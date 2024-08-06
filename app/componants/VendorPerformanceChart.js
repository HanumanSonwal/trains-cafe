// components/VendorPerformanceChart.js
"use client";
import React from 'react';
import { Card, Table } from 'antd';

const columns = [
  {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
  },
  {
    title: 'Order Accuracy',
    dataIndex: 'accuracy',
    key: 'accuracy',
  },
  {
    title: 'Delivery Time',
    dataIndex: 'deliveryTime',
    key: 'deliveryTime',
  },
  {
    title: 'User Rating',
    dataIndex: 'rating',
    key: 'rating',
  },
];

const data = [
  {
    key: '1',
    vendor: 'Vendor A',
    accuracy: '95%',
    deliveryTime: '2 days',
    rating: '4.5',
  },
  // Add more data here
];

const VendorPerformanceChart = () => (
  <Card title="Vendor Performance">
    <Table columns={columns} dataSource={data} />
  </Card>
);

export default VendorPerformanceChart;
