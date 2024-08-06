// components/OngoingOrdersChart.js
"use client";
import React from 'react';
import { Card, Table } from 'antd';

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Order Date',
    dataIndex: 'orderDate',
    key: 'orderDate',
  },
  {
    title: 'Expected Delivery Date',
    dataIndex: 'deliveryDate',
    key: 'deliveryDate',
  },
];

const data = [
  {
    key: '1',
    orderId: '1234',
    status: 'Preparing',
    orderDate: '2024-08-01',
    deliveryDate: '2024-08-05',
  },
  // Add more data here
];

const OngoingOrdersChart = () => (
  <Card title="Ongoing Orders">
    <Table columns={columns} dataSource={data} />
  </Card>
);

export default OngoingOrdersChart;
