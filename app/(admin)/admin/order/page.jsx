"use client";
import React, { useState } from 'react';
import { Table, Button, DatePicker, Select, Input, Space, Tag } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const OrdersTable = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      orderID: 'TC000353',
      date: '23-08-2024 15:52:38',
      admin: 'Admin',
      vendor: 'Madras Bakery',
      contact: '7798168161',
      details: '1x Dal Rice Combo',
      deliveryDetails: {
        name: 'subi richa',
        mobile: '9260997672',
        train: '12629 (A 1 25)',
        pnr: '4517555983',
        deliveryTime: '23-08-2024 17:40',
        station: 'Bhusaval Junction (BSL)',
      },
      amount: 117,
      status: 'Confirm',
      paymentStatus: 'Pending',
    },
    // Add more orders as needed
  ]);

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderID',
      key: 'orderID',
      render: (text, record) => (
        <>
          <p>{`(${record.date})`}</p>
          <p>{text}</p>
          <p>({record.admin})</p>
        </>
      ),
    },
    {
      title: 'Order Details',
      dataIndex: 'vendor',
      key: 'vendor',
      render: (text, record) => (
        <div>
          <p>Vendor: {text}</p>
          <p>Contact: {record.contact}</p>
          <p>{record.details}</p>
        </div>
      ),
    },
    {
      title: 'Delivery Details',
      dataIndex: 'deliveryDetails',
      key: 'deliveryDetails',
      render: (details) => (
        <div>
          <p>Name: {details.name}</p>
          <p>Mobile: {details.mobile}</p>
          <p>Train No: {details.train}</p>
          <p>PNR: {details.pnr}</p>
          <p>Delivery: {details.deliveryTime}</p>
          <p>Station: {details.station}</p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span>{`₹ ${amount}`}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Space>
          <Tag color={status === 'Confirm' ? 'purple' : 'green'}>{status}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <Space>
          <Tag color="gold">{status}</Tag>
          <Button type="link">Change</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="orders-table">
      <div className="filters flex justify-between mb-4">
        <div className="flex space-x-4">
          <RangePicker />
          <Select defaultValue="All" style={{ width: 120 }}>
            <Option value="All">All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
          </Select>
          <Input placeholder="Search" />
        </div>
        <div className="flex space-x-2">
          <Button type="primary" icon={<PlusOutlined />} className="bg-brown">
            Add New Orders
          </Button>
          <Button icon={<DownloadOutlined />}>Download</Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.details}</p>
          ),
        }}
      />
    </div>
  );
};

export default OrdersTable;
